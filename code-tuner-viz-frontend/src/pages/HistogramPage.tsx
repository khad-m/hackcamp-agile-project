import React from "react";
import { createMetricsApi } from "../features/metrics/api";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export function HistogramPage() {
  const api = React.useMemo(() => createMetricsApi(), []);
  const [data, setData] = React.useState<{ label: string; count: number }[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const d = await api.getComplexityHistogram();
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
      <h2>Complexity Histogram</h2>
      <p className="small">Distribution of cyclomatic complexity across measured classes.</p>

      {loading && <p>Loading</p>}
      {error && <p style={{ color: "crimson" }}>{error}</p>}

      {!loading && !error && (
        <>
          <div className="chartBox">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ left: 8, right: 18, top: 6, bottom: 6 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" tickMargin={8} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="small">Buckets: {data.length}</p>
        </>
      )}
    </div>
  );
}
