import type { MetricsApi } from "./MetricsApi";
import type { BenchmarkRow, ClassSize, HistogramBucket, TrendPoint } from "../models";

export class MockMetricsApi implements MetricsApi {
  async getComplexityHistogram(): Promise<HistogramBucket[]> {
    return [
      { label: "0-2", count: 18 },
      { label: "3-5", count: 22 },
      { label: "6-8", count: 10 },
      { label: "9-12", count: 6 },
      { label: "13+", count: 3 },
    ];
  }

  async getClassSizes(): Promise<ClassSize[]> {
    return [
      { className: "UserService", loc: 240, methods: 18 },
      { className: "OrderController", loc: 180, methods: 12 },
      { className: "InvoiceGenerator", loc: 310, methods: 22 },
      { className: "MetricsCollector", loc: 150, methods: 10 },
      { className: "AuthMiddleware", loc: 120, methods: 7 },
    ];
  }

  async getComplexityTrend(): Promise<TrendPoint[]> {
    return [
      { date: "2025-01-01", avgComplexity: 4.2 },
      { date: "2025-02-01", avgComplexity: 4.6 },
      { date: "2025-03-01", avgComplexity: 5.1 },
      { date: "2025-04-01", avgComplexity: 4.8 },
      { date: "2025-05-01", avgComplexity: 4.4 },
    ];
  }

  async getBenchmarks(): Promise<BenchmarkRow[]> {
    return [
      { project: "Your Project", avgComplexity: 4.7, avgClassSize: 210 },
      { project: "Benchmark A", avgComplexity: 5.6, avgClassSize: 240 },
      { project: "Benchmark B", avgComplexity: 3.9, avgClassSize: 190 },
    ];
  }
}
