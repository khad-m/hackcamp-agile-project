import type { MetricsApi } from "./MetricsApi";
import type { BenchmarkRow, ClassSize, HistogramBucket, TrendPoint } from "../models";
import { env } from "../../../shared/lib/env";

type Fetcher = (path: string) => Promise<unknown>;

export class HttpMetricsApi implements MetricsApi {
  private readonly fetcher: Fetcher;

  constructor(fetcher?: Fetcher) {
    // Dependency inversion: allow injecting a different transport for tests.
    this.fetcher =
      fetcher ??
      (async (path: string) => {
        const base = env.apiBaseUrl ?? "";
        const res = await fetch(`${base}${path}`);
        if (!res.ok) throw new Error(`HTTP ${res.status} for ${path}`);
        return res.json();
      });
  }

  async getComplexityHistogram(): Promise<HistogramBucket[]> {
    return (await this.fetcher("/api/metrics/complexity-histogram")) as HistogramBucket[];
  }

  async getClassSizes(): Promise<ClassSize[]> {
    return (await this.fetcher("/api/metrics/class-sizes")) as ClassSize[];
  }

  async getComplexityTrend(): Promise<TrendPoint[]> {
    return (await this.fetcher("/api/metrics/complexity-trend")) as TrendPoint[];
  }

  async getBenchmarks(): Promise<BenchmarkRow[]> {
    return (await this.fetcher("/api/metrics/benchmarks")) as BenchmarkRow[];
  }
}
