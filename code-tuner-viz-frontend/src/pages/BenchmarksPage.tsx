import React from "react";
import { createMetricsApi } from "../features/metrics/api";
import { CodeBlock } from "../shared/ui/CodeBlock";
import { Layout } from "../shared/ui/Layout";
import { Card } from "../shared/ui/Card";

export function BenchmarksPage() {
  const api = React.useMemo(() => createMetricsApi(), []);
  const [rows, setRows] = React.useState<{ project: string; avgComplexity: number; avgClassSize: number }[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [showJson, setShowJson] = React.useState(false);

  React.useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const d = await api.getBenchmarks();
        if (alive) setRows(d);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [api]);

  const json = JSON.stringify(rows, null, 2);

  return (
    <Layout title="Benchmarks">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card title="Benchmark table" subtitle="Compare repositories using the latest commit snapshot.">
          {loading ? (
            <p className="text-sm text-zinc-600">Loading…</p>
          ) : (
            <div className="overflow-hidden rounded-xl border">
              <table className="w-full border-collapse text-sm">
                <thead className="bg-zinc-50">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium text-zinc-700">Project</th>
                    <th className="px-4 py-3 text-right font-medium text-zinc-700">Avg Complexity</th>
                    <th className="px-4 py-3 text-right font-medium text-zinc-700">Avg Class Size</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r, idx) => (
                    <tr key={r.project} className={idx % 2 ? "bg-white" : "bg-zinc-50/40"}>
                      <td className="px-4 py-3 text-zinc-900">{r.project}</td>
                      <td className="px-4 py-3 text-right tabular-nums">{r.avgComplexity.toFixed(1)}</td>
                      <td className="px-4 py-3 text-right tabular-nums">{Math.round(r.avgClassSize)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        <Card
          title="Raw JSON"
          subtitle="For debugging / marking criteria evidence."
          right={
            <button
              onClick={() => setShowJson((s) => !s)}
              className="rounded-full border bg-white px-3 py-1.5 text-sm text-zinc-700 hover:bg-zinc-50"
            >
              {showJson ? "Hide" : "Show"}
            </button>
          }
        >
          {showJson ? <CodeBlock language="json" code={json || "[]"} /> : <p className="text-sm text-zinc-600">Hidden.</p>}
        </Card>
      </div>
    </Layout>
  );
}
