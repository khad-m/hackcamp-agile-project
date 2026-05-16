import type { BenchmarkRow, ClassSize, HistogramBucket, TrendPoint } from "../domain/models";

export interface MetricsRepository {
  getHistogram(project?: string): Promise<HistogramBucket[]>;
  getClassSizes(limit: number, project?: string): Promise<ClassSize[]>;
  getTrend(project?: string): Promise<TrendPoint[]>;
  getBenchmarks(): Promise<BenchmarkRow[]>;
}
