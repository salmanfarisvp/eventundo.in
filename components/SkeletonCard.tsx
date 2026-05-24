export default function SkeletonCard() {
  return (
    <div className="animate-pulse border-2 p-4 flex flex-col gap-3"
      style={{ background: "var(--bg-card)", borderColor: "var(--border)", boxShadow: "var(--shadow)" }}>
      <div className="h-5 w-20 rounded-none" style={{ background: "var(--bg-subtle)" }} />
      <div className="h-5 w-4/5 rounded-none" style={{ background: "var(--bg-subtle)" }} />
      <div className="flex flex-col gap-2">
        <div className="h-4 w-2/3 rounded-none" style={{ background: "var(--bg-subtle)" }} />
        <div className="h-4 w-1/2 rounded-none" style={{ background: "var(--bg-subtle)" }} />
      </div>
      <div className="h-11 w-full rounded-none border-2" style={{ background: "var(--bg-subtle)", borderColor: "var(--border)" }} />
    </div>
  );
}

export function SkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
