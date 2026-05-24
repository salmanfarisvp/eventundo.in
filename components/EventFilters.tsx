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
      if (value) { params.set(key, value); } else { params.delete(key); }
      router.push(`/?${params.toString()}`, { scroll: false });
    },
    [router, searchParams]
  );

  const hasFilters = district || category;

  const selectStyle = {
    background: "var(--bg-card)",
    color: "var(--text)",
    borderColor: "var(--border)",
    boxShadow: "var(--shadow-xs)",
  };

  return (
    <div className="flex flex-col sm:flex-row gap-2">
      {/* District */}
      <div className="relative flex-1">
        <select value={district} onChange={(e) => updateFilter("district", e.target.value)}
          className="brutal-input w-full appearance-none text-sm font-bold px-3.5 py-2.5 pr-9 min-h-[44px] cursor-pointer"
          style={selectStyle}>
          <option value="">ജില്ല — All Districts</option>
          {KERALA_DISTRICTS.map((d) => <option key={d} value={d}>{d}</option>)}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center"
          style={{ color: "var(--text-faint)" }}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* Category */}
      <div className="relative flex-1">
        <select value={category} onChange={(e) => updateFilter("category", e.target.value)}
          className="brutal-input w-full appearance-none text-sm font-bold px-3.5 py-2.5 pr-9 min-h-[44px] cursor-pointer"
          style={selectStyle}>
          <option value="">വിഭാഗം — All Categories</option>
          {EVENT_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center"
          style={{ color: "var(--text-faint)" }}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* Clear */}
      {hasFilters && (
        <button onClick={() => router.push("/", { scroll: false })}
          className="brutal-btn brutal-btn-ghost text-sm px-4 py-2.5 rounded-none min-h-[44px] gap-1.5 whitespace-nowrap">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
          Clear
        </button>
      )}
    </div>
  );
}
