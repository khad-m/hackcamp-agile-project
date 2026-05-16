import React from "react";
import { createMetricsApi } from "../features/metrics/api";
import { CodeBlock } from "../shared/ui/CodeBlock";

export function OverviewPage() {
  const api = React.useMemo(() => createMetricsApi(), []);
  const [loading, setLoading] = React.useState(true);
  const [kpis, setKpis] = React.useState({ totalClasses: 0, avgComplexity: 0, avgLoc: 0 });

  React.useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const [hist, sizes, trend] = await Promise.all([
          api.getComplexityHistogram(),
          api.getClassSizes(),
          api.getComplexityTrend(),
        ]);

        const totalClasses = hist.reduce((a, b) => a + b.count, 0);
        const avgLoc = sizes.length ? Math.round(sizes.reduce((a, b) => a + b.loc, 0) / sizes.length) : 0;
        const avgComplexity = trend.length ? trend[trend.length - 1].avgComplexity : 0;

        if (alive) setKpis({ totalClasses, avgComplexity, avgLoc });
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [api]);

  const exampleQuery = `SELECT
  class_name,
  cyclomatic_complexity,
  lines_of_code,
  created_at
FROM metrics
WHERE created_at >= NOW() - INTERVAL '30 days'
ORDER BY created_at ASC;`;

  return (
    <div className="grid two">
      <div className="card">
        <h2>Overview</h2>
        <p className="small">
          This frontend is ready for your Code Tuner visualisations. Right now it can run on mock data
          (VITE_USE_MOCKS=true) or later call your backend API.
        </p>

        {loading ? (
          <p>Loading KPIs</p>
        ) : (
          <div className="grid">
            <div className="card">
              <div className="small">Total classes measured</div>
              <div className="kpi">{kpis.totalClasses}</div>
            </div>
            <div className="card">
              <div className="small">Latest avg complexity</div>
              <div className="kpi">{kpis.avgComplexity.toFixed(1)}</div>
            </div>
            <div className="card">
              <div className="small">Avg LOC per class</div>
              <div className="kpi">{kpis.avgLoc}</div>
            </div>
          </div>
        )}
      </div>

      <div className="card">
        <h2>Prism demo</h2>
        <p className="small">Example SQL you might use in the backend (highlighted via PrismJS):</p>
        <CodeBlock language="sql" code={exampleQuery} />
      </div>
    </div>
  );
}
