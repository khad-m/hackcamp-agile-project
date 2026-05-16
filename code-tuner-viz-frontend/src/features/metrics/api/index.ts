import { env } from "../../../shared/lib/env";
import type { MetricsApi } from "./MetricsApi";
import { MockMetricsApi } from "./MockMetricsApi";
import { HttpMetricsApi } from "./HttpMetricsApi";

export function createMetricsApi(): MetricsApi {
  return env.useMocks ? new MockMetricsApi() : new HttpMetricsApi();
}
