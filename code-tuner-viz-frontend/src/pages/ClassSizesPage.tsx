import React from "react";
import { createMetricsApi } from "../features/metrics/api";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export function ClassSizesPage() {
  const api = React.useMemo(() => createMetricsApi(), []);
  const [data, setData] = React.useState<{ className: string; loc: number; methods: number }[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const d = await api.getClassSizes();
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
    <div className="grid">
      <div className="card">
        <h2>Class Sizes</h2>
        <p className="small">Lines of code (LOC) per class, useful for spotting bloat.</p>

        {loading && <p>Loading</p>}
        {error && <p style={{ color: "crimson" }}>{error}</p>}

        {!loading && !error && (
          <>
            <div className="chartBox">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ left: 8, right: 18, top: 6, bottom: 6 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="className" hide />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="loc" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="small">Classes: {data.length}</p>
          </>
        )}
      </div>

      {!loading && !error && (
        <div className="card">
          <h3>Raw table</h3>
          <table>
            <thead>
              <tr>
                <th>Class</th>
                <th style={{ textAlign: "right" }}>LOC</th>
                <th style={{ textAlign: "right" }}>Methods</th>
              </tr>
            </thead>
            <tbody>
              {data.map((r) => (
                <tr key={r.className}>
                  <td>{r.className}</td>
                  <td style={{ textAlign: "right" }}>{r.loc}</td>
                  <td style={{ textAlign: "right" }}>{r.methods}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
