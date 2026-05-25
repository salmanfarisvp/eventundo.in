"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { KERALA_DISTRICTS, EVENT_CATEGORIES } from "@/lib/constants";

export default function EventFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const district = searchParams.get("district") || "";
  const category = searchParams.get("category") || "";

  const updateFilter = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      router.push(`/?${params.toString()}`, { scroll: false });
    },
    [router, searchParams]
  );

  const selectClass =
    "appearance-none text-sm font-medium px-3.5 py-2 pr-9 rounded-xl focus:outline-none transition-colors cursor-pointer border";

  const hasFilters = district || category;

  return (
    <div className="flex flex-row flex-wrap gap-2 items-center">
      {/* District filter */}
      <div className="relative">
        <select
          value={district}
          onChange={(e) => updateFilter("district", e.target.value)}
          className={selectClass}
          style={{
            background: "var(--bg-card)",
            color: "var(--text)",
            borderColor: district ? "var(--accent)" : "var(--border)",
          }}
        >
          <option value="">ജില്ല / All Districts</option>
          {KERALA_DISTRICTS.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
        <div
          className="pointer-events-none absolute inset-y-0 right-3 flex items-center"
          style={{ color: "var(--text-faint)" }}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* Category filter */}
      <div className="relative">
        <select
          value={category}
          onChange={(e) => updateFilter("category", e.target.value)}
          className={selectClass}
          style={{
            background: "var(--bg-card)",
            color: "var(--text)",
            borderColor: category ? "var(--accent)" : "var(--border)",
          }}
        >
          <option value="">വിഭാഗം / All Categories</option>
          {EVENT_CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <div
          className="pointer-events-none absolute inset-y-0 right-3 flex items-center"
          style={{ color: "var(--text-faint)" }}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* Clear */}
      {hasFilters && (
        <button
          onClick={() => router.push("/", { scroll: false })}
          className="flex items-center justify-center gap-1.5 text-sm font-medium px-4 py-2.5 rounded-xl min-h-[44px] border transition-opacity hover:opacity-70 whitespace-nowrap"
          style={{
            background: "var(--bg-card)",
            color: "var(--text-muted)",
            borderColor: "var(--border)",
          }}
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          Clear
        </button>
      )}
    </div>
  );
}
