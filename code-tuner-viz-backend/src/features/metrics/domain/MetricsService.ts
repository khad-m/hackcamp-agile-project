import type { MetricsRepository } from "../data/MetricsRepository";
import type { BenchmarkRow, ClassSize, HistogramBucket, TrendPoint } from "./models";

export class MetricsService {
  constructor(private readonly repo: MetricsRepository) {}

  getComplexityHistogram(project?: string): Promise<HistogramBucket[]> {
    return this.repo.getHistogram(project);
  }

  getClassSizes(limit: number, project?: string): Promise<ClassSize[]> {
    return this.repo.getClassSizes(limit, project);
  }

  getComplexityTrend(project?: string): Promise<TrendPoint[]> {
    return this.repo.getTrend(project);
  }

  getBenchmarks(): Promise<BenchmarkRow[]> {
    return this.repo.getBenchmarks();
  }
}
