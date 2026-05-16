export type HistogramBucket = {
  label: string;
  count: number;
};

export type ClassSize = {
  className: string;
  loc: number;
  methods: number;
};

export type TrendPoint = {
  date: string;          // YYYY-MM-DD
  avgComplexity: number;
};

export type BenchmarkRow = {
  project: string;
  avgComplexity: number;
  avgClassSize: number;
};
