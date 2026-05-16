import { prisma } from "../../../shared/prisma";
import type { MetricsRepository } from "./MetricsRepository";
import type { BenchmarkRow, ClassSize, HistogramBucket, TrendPoint } from "../domain/models";

type Filters = {
  owner?: string;
  repo?: string;
  language?: string;
  packageName?: string;
  /**
   * project can be:
   *  - "owner/repo"
   *  - "repo"
   */
  project?: string;
};

function parseProject(project?: string): { owner?: string; repo?: string } {
  if (!project) return {};
  if (project.includes("/")) {
    const [owner, repo] = project.split("/");
    return { owner, repo };
  }
  return { repo: project };
}

function buildWhere(filters: Filters, tableAlias?: string) {
  const a = tableAlias ? `${tableAlias}.` : "";
  const conditions: string[] = [];
  const params: any[] = [];

  const proj = parseProject(filters.project);
  const owner = filters.owner ?? proj.owner;
  const repo = filters.repo ?? proj.repo;

  if (owner) {
    params.push(owner);
    conditions.push(`${a}repository_owner = $${params.length}`);
  }
  if (repo) {
    params.push(repo);
    conditions.push(`${a}repository_name = $${params.length}`);
  }
  if (filters.language) {
    params.push(filters.language);
    conditions.push(`${a}language = $${params.length}`);
  }
  if (filters.packageName) {
    params.push(filters.packageName);
    conditions.push(`${a}package_name = $${params.length}`);
  }

  const whereSql = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
  return { whereSql, params };
}

/**
 * Many tables contain multiple commits.
 * For "current" stats (histogram/class sizes) we default to the latest commit snapshot
 * for the chosen filter set (or latest overall if no filters).
 */
function latestClassSnapshotCTE(filters: Filters) {
  const { whereSql, params } = buildWhere(filters);

  const sql = `
    WITH filtered AS (
      SELECT *
      FROM class_metrics
      ${whereSql}
    ),
    latest AS (
      SELECT MAX(commit_date) AS latest_commit_date
      FROM filtered
    ),
    snapshot AS (
      SELECT *
      FROM filtered
      WHERE commit_date = (SELECT latest_commit_date FROM latest)
    )
  `;

  return { sql, params };
}

export class PrismaMetricsRepository implements MetricsRepository {
  /**
   * Histogram for class complexity (class_complexity) using latest commit snapshot.
   * Buckets: 0-2, 3-5, 6-8, 9-12, 13+
   */
  async getHistogram(project?: string): Promise<HistogramBucket[]> {
    const { sql, params } = latestClassSnapshotCTE({ project });

    const rows = await prisma.$queryRawUnsafe<Array<{ label: string; count: number }>>(
      `
      ${sql}
      SELECT label, COUNT(*)::int AS count
      FROM (
        SELECT
          CASE
            WHEN class_complexity BETWEEN 0 AND 2 THEN '0-2'
            WHEN class_complexity BETWEEN 3 AND 5 THEN '3-5'
            WHEN class_complexity BETWEEN 6 AND 8 THEN '6-8'
            WHEN class_complexity BETWEEN 9 AND 12 THEN '9-12'
            ELSE '13+'
          END AS label
        FROM snapshot
      ) t
      GROUP BY label
      ORDER BY
        CASE label
          WHEN '0-2' THEN 1
          WHEN '3-5' THEN 2
          WHEN '6-8' THEN 3
          WHEN '9-12' THEN 4
          ELSE 5
        END;
      `,
      ...params
    );

    // Always return all buckets even if some are empty
    const wanted = ["0-2", "3-5", "6-8", "9-12", "13+"];
    const map = new Map(rows.map((r) => [r.label, r.count]));
    return wanted.map((label) => ({ label, count: map.get(label) ?? 0 }));
  }

  /**
   * Class sizes using latest commit snapshot.
   * class_loc and method_count are already present in class_metrics.
   */
  async getClassSizes(limit: number, project?: string): Promise<ClassSize[]> {
    const { sql, params } = latestClassSnapshotCTE({ project });

    const rows = await prisma.$queryRawUnsafe<
      Array<{ class_name: string; loc: number; methods: number }>
    >(
      `
      ${sql}
      SELECT
        class_name,
        AVG(class_loc)::float AS loc,
        AVG(method_count)::float AS methods
      FROM snapshot
      GROUP BY class_name
      ORDER BY AVG(class_loc) DESC
      LIMIT $${params.length + 1};
      `,
      ...params,
      limit
    );

    return rows.map((r) => ({
      className: r.class_name,
      loc: Math.round(Number(r.loc)),
      methods: Math.round(Number(r.methods)),
    }));
  }

  /**
   * Trend of class complexity across time.
   * Uses all commits and aggregates by week by default.
   */
  async getTrend(project?: string): Promise<TrendPoint[]> {
    const period = "week"; // "day" | "week" | "month"
    const { whereSql, params } = buildWhere({ project });

    const rows = await prisma.$queryRawUnsafe<Array<{ bucket: Date; avg: number }>>(
      `
      SELECT
        date_trunc('${period}', commit_date) AS bucket,
        AVG(class_complexity)::float AS avg
      FROM class_metrics
      ${whereSql}
      GROUP BY 1
      ORDER BY 1 ASC;
      `,
      ...params
    );

    return rows.map((r) => ({
      date: new Date(r.bucket).toISOString().slice(0, 10),
      avgComplexity: Number(r.avg),
    }));
  }

  /**
   * Benchmarks across repos using latest commit snapshot per repo.
   * Returns project as "owner/repo".
   */
  async getBenchmarks(): Promise<BenchmarkRow[]> {
    const rows = await prisma.$queryRawUnsafe<
      Array<{ project: string; avgcomplexity: number; avgclasssize: number }>
    >(
      `
      WITH latest_per_repo AS (
        SELECT repository_owner, repository_name, MAX(commit_date) AS latest_commit_date
        FROM class_metrics
        GROUP BY repository_owner, repository_name
      ),
      snapshot AS (
        SELECT c.*
        FROM class_metrics c
        JOIN latest_per_repo l
          ON c.repository_owner = l.repository_owner
         AND c.repository_name  = l.repository_name
         AND c.commit_date      = l.latest_commit_date
      )
      SELECT
        (repository_owner || '/' || repository_name) AS project,
        AVG(class_complexity)::float AS avgComplexity,
        AVG(class_loc)::float AS avgClassSize
      FROM snapshot
      GROUP BY 1
      ORDER BY 1 ASC;
      `
    );

    // postgres lowercases some column names depending on driver;
    // handle both forms just in case
    return rows.map((r: any) => ({
      project: r.project,
      avgComplexity: Number(r.avgcomplexity ?? r.avgComplexity),
      avgClassSize: Number(r.avgclasssize ?? r.avgClassSize),
    }));
  }
}
