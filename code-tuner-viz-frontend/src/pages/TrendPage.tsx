import React from "react";
import { createMetricsApi } from "../features/metrics/api";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export function TrendPage() {
  const api = React.useMemo(() => createMetricsApi(), []);
  const [data, setData] = React.useState<{ date: string; avgComplexity: number }[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const d = await api.getComplexityTrend();
        if (alive) setData(d);
      } catch (e) {
        if (alive) setError(e instanceof Error ? e.message : "Unknown error");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [api]);

  return (
    <div className="card">
      <h2>Complexity Trend</h2>
      <p className="small">Average cyclomatic complexity over time (per day/week/month).</p>

      {loading && <p>Loading</p>}
      {error && <p style={{ color: "crimson" }}>{error}</p>}

      {!loading && !error && (
        <>
          <div className="chartBox">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ left: 8, right: 18, top: 6, bottom: 6 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tickMargin={8} minTickGap={24} />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="avgComplexity" dot />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <p className="small">Points: {data.length}</p>
        </>
      )}
    </div>
  );
}
