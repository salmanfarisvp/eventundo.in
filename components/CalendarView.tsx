"use client";

import { useState } from "react";
import Link from "next/link";
import EventCard from "./EventCard";
import type { Database } from "@/lib/types";

type Event = Database["public"]["Tables"]["events"]["Row"];

const WEEKDAYS_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const WEEKDAYS_MIN   = ["S", "M", "T", "W", "T", "F", "S"];

// Each Gregorian month overlaps two Malayalam (Kollavarsham) months
const ML_MONTHS: [string, string][] = [
  ["ധനു",      "മകരം"],     // Jan
  ["മകരം",     "കുംഭം"],    // Feb
  ["കുംഭം",    "മീനം"],     // Mar
  ["മീനം",     "മേടം"],     // Apr
  ["മേടം",     "ഇടവം"],     // May
  ["ഇടവം",     "മിഥുനം"],   // Jun
  ["മിഥുനം",   "കർക്കടകം"], // Jul
  ["കർക്കടകം", "ചിങ്ങം"],   // Aug
  ["ചിങ്ങം",   "കന്നി"],    // Sep
  ["കന്നി",    "തുലാം"],    // Oct
  ["തുലാം",    "വൃശ്ചികം"], // Nov
  ["വൃശ്ചികം", "ധനു"],      // Dec
];

// Kollavarsham year: new year starts ~Aug 17
// Jan–Jul: gregorianYear − 825, Aug–Dec: gregorianYear − 824
function getMalayalamYear(gregorianYear: number, month: number): number {
  return month >= 7 ? gregorianYear - 824 : gregorianYear - 825;
}

function toDateKey(y: number, m: number, d: number) {
  return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

function formatSelectedHeading(dateStr: string) {
  return new Date(dateStr + "T00:00:00").toLocaleDateString("en-IN", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });
}

export default function CalendarView({ events }: { events: Event[] }) {
  const today = new Date();
  const [year, setYear]       = useState(today.getFullYear());
  const [month, setMonth]     = useState(today.getMonth());
  const [selected, setSelected] = useState<string | null>(null);

  const byDate: Record<string, Event[]> = {};
  events.forEach((ev) => {
    if (!byDate[ev.event_date]) byDate[ev.event_date] = [];
    byDate[ev.event_date].push(ev);
  });

  const todayStr        = today.toISOString().split("T")[0];
  const firstWeekday    = new Date(year, month, 1).getDay();
  const daysInMonth     = new Date(year, month + 1, 0).getDate();
  const monthLabel      = new Date(year, month, 1).toLocaleDateString("en-IN", {
    month: "long", year: "numeric",
  });

  const cells: (number | null)[] = [
    ...Array(firstWeekday).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  // pad to complete last row
  while (cells.length % 7 !== 0) cells.push(null);

  const goBack = () => {
    setSelected(null);
    month === 0 ? (setMonth(11), setYear((y) => y - 1)) : setMonth((m) => m - 1);
  };
  const goForward = () => {
    setSelected(null);
    month === 11 ? (setMonth(0), setYear((y) => y + 1)) : setMonth((m) => m + 1);
  };
  const goToday = () => {
    setSelected(null);
    setYear(today.getFullYear());
    setMonth(today.getMonth());
  };

  const selectedEvents = selected ? (byDate[selected] ?? []) : [];

  return (
    <div className="flex flex-col gap-6">

      {/* ── Month header ─────────────────────────────────── */}
      <div className="flex items-center gap-3">
        <button onClick={goBack} aria-label="Previous month"
          className="p-2 rounded-lg transition-colors hover:bg-[var(--bg-subtle)]"
          style={{ color: "var(--text-muted)" }}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button onClick={goForward} aria-label="Next month"
          className="p-2 rounded-lg transition-colors hover:bg-[var(--bg-subtle)]"
          style={{ color: "var(--text-muted)" }}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        <div className="flex flex-col leading-tight">
          <h2 className="text-lg font-bold" style={{ color: "var(--text)" }}>
            {monthLabel}
          </h2>
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>
            {ML_MONTHS[month][0]} – {ML_MONTHS[month][1]}&nbsp;
            <span style={{ color: "var(--text-faint)" }}>
              {getMalayalamYear(year, month)} ME
            </span>
          </span>
        </div>

        <button onClick={goToday}
          className="ml-auto text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors hover:bg-[var(--bg-subtle)]"
          style={{ color: "var(--text-muted)", borderColor: "var(--border)" }}>
          Today
        </button>
      </div>

      {/* ── Calendar grid ────────────────────────────────── */}
      <div className="rounded-xl border overflow-hidden"
        style={{ borderColor: "var(--border)", background: "var(--bg-card)" }}>

        {/* Weekday name headers */}
        <div className="grid grid-cols-7 border-b" style={{ borderColor: "var(--border)" }}>
          {WEEKDAYS_SHORT.map((d, i) => (
            <div key={d} className="py-2 text-center border-r last:border-r-0"
              style={{ borderColor: "var(--border)" }}>
              <span className="hidden md:inline text-xs font-semibold uppercase tracking-wide"
                style={{ color: "var(--text-faint)" }}>{WEEKDAYS_SHORT[i]}</span>
              <span className="md:hidden text-xs font-semibold uppercase"
                style={{ color: "var(--text-faint)" }}>{WEEKDAYS_MIN[i]}</span>
            </div>
          ))}
        </div>

        {/* Day cells */}
        <div className="grid grid-cols-7">
          {cells.map((day, i) => {
            if (!day) {
              return (
                <div key={`e-${i}`}
                  className="border-r border-b last:border-r-0 min-h-[80px] md:min-h-[110px]"
                  style={{ borderColor: "var(--border)", background: "var(--bg-subtle)" }} />
              );
            }

            const dateStr     = toDateKey(year, month, day);
            const dayEvents   = byDate[dateStr] ?? [];
            const isToday     = dateStr === todayStr;
            const isSelected  = dateStr === selected;
            const overflow    = dayEvents.length > 3 ? dayEvents.length - 2 : 0;
            const visible     = overflow > 0 ? dayEvents.slice(0, 2) : dayEvents;

            return (
              <div
                key={dateStr}
                onClick={() => setSelected(isSelected ? null : dateStr)}
                className="border-r border-b last:border-r-0 min-h-[80px] md:min-h-[110px] p-1.5 cursor-pointer transition-colors"
                style={{
                  borderColor: "var(--border)",
                  background: isSelected ? "var(--accent-soft)" : "transparent",
                }}
              >
                {/* Day number */}
                <div className="flex justify-start mb-1">
                  <span
                    className="w-6 h-6 flex items-center justify-center text-xs font-semibold rounded-full leading-none"
                    style={
                      isToday
                        ? { background: "var(--accent)", color: "#fff" }
                        : isSelected
                        ? { background: "var(--accent-text)", color: "#fff" }
                        : { color: "var(--text-muted)" }
                    }
                  >
                    {day}
                  </span>
                </div>

                {/* Event chips */}
                <div className="flex flex-col gap-0.5">
                  {visible.map((ev) => (
                    <Link
                      key={ev.id}
                      href={`/events/${ev.id}`}
                      onClick={(e) => e.stopPropagation()}
                      className="block truncate text-[10px] md:text-xs font-medium px-1.5 py-0.5 rounded transition-opacity hover:opacity-80"
                      style={{ background: "var(--accent)", color: "#fff" }}
                      title={ev.title}
                    >
                      <span className="hidden md:inline">{ev.title}</span>
                      <span className="md:hidden">●</span>
                    </Link>
                  ))}
                  {overflow > 0 && (
                    <span className="text-[10px] md:text-xs font-medium px-1.5"
                      style={{ color: "var(--text-faint)" }}>
                      +{overflow} more
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Selected day panel ───────────────────────────── */}
      {selected && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-base" style={{ color: "var(--text)" }}>
                {formatSelectedHeading(selected)}
              </p>
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                {selectedEvents.length === 0
                  ? "No events"
                  : `${selectedEvents.length} event${selectedEvents.length !== 1 ? "s" : ""}`}
              </p>
            </div>
            <button onClick={() => setSelected(null)}
              className="p-2 rounded-lg transition-colors hover:bg-[var(--bg-subtle)]"
              style={{ color: "var(--text-faint)" }}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {selectedEvents.length === 0 ? (
            <div className="py-10 text-center rounded-xl border"
              style={{ borderColor: "var(--border)", color: "var(--text-faint)", background: "var(--bg-card)" }}>
              No events scheduled on this day
            </div>
          ) : (
            <div className="grid gap-3"
              style={{ gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))" }}>
              {selectedEvents.map((ev) => (
                <EventCard key={ev.id} event={ev} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
