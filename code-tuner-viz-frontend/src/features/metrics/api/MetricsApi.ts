import type { BenchmarkRow, ClassSize, HistogramBucket, TrendPoint } from "../models";

export interface MetricsApi {
  getComplexityHistogram(): Promise<HistogramBucket[]>;
  getClassSizes(): Promise<ClassSize[]>;
  getComplexityTrend(): Promise<TrendPoint[]>;
  getBenchmarks(): Promise<BenchmarkRow[]>;
}
