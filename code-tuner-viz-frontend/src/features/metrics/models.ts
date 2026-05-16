export type HistogramBucket = {
  label: string;   // e.g. "0-2"
  count: number;   // number of classes in this bucket
};

export type ClassSize = {
  className: string;
  loc: number;
  methods: number;
};

export type TrendPoint = {
  date: string;          // ISO date (or YYYY-MM-DD)
  avgComplexity: number; // average complexity at that time
};

export type BenchmarkRow = {
  project: string;
  avgComplexity: number;
  avgClassSize: number;
};
