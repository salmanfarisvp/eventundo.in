export default function SkeletonCard() {
  return (
    <div
      className="rounded-xl p-4 flex flex-col gap-2.5 animate-pulse border"
      style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}
    >
      <div className="h-5 w-20 rounded-full" style={{ background: "var(--bg-subtle)" }} />
      <div className="h-6 w-4/5 rounded-lg" style={{ background: "var(--bg-subtle)" }} />
      <div className="flex flex-col gap-2">
        <div className="h-4 w-2/3 rounded" style={{ background: "var(--bg-subtle)" }} />
        <div className="h-4 w-1/2 rounded" style={{ background: "var(--bg-subtle)" }} />
      </div>
      <div className="border-t" style={{ borderColor: "var(--border)" }} />
      <div className="h-12 w-full rounded-xl" style={{ background: "var(--bg-subtle)" }} />
    </div>
  );
}

export function SkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-3 items-start" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))" }}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
