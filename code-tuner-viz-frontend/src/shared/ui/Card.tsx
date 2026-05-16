export function Card({
  title,
  subtitle,
  right,
  children,
}: {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border bg-white shadow-soft">
      <div className="flex items-start justify-between gap-4 border-b px-6 py-5">
        <div>
          <h2 className="text-lg font-semibold text-zinc-900">{title}</h2>
          {subtitle ? <p className="mt-1 text-sm text-zinc-500">{subtitle}</p> : null}
        </div>
        {right}
      </div>
      <div className="px-6 py-6">{children}</div>
    </section>
  );
}
