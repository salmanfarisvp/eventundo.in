"use client";

import { useEffect, useState } from "react";

function pad(n: number) {
  return n.toString().padStart(2, "0");
}

export default function LiveClock() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  if (!now) return <div className="w-24 h-8" />;

  const time = `${pad(now.getHours())}:${pad(now.getMinutes())}`;
  const date = now.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    weekday: "short",
  });

  return (
    <div className="hidden sm:flex flex-col items-end leading-none gap-0.5">
      <span className="text-sm font-bold tabular-nums" style={{ color: "var(--text)" }}>
        {time}
      </span>
      <span className="text-[11px]" style={{ color: "var(--text-faint)" }}>
        {date}
      </span>
    </div>
  );
}
