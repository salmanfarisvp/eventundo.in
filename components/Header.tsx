"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import ThemeToggle from "./ThemeToggle";
import LiveClock from "./LiveClock";
import AdminLogoutButton from "./AdminLogoutButton";

export default function Header() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isSubmitPage = pathname === "/submit";
  const isAdminPage  = pathname.startsWith("/admin");
  const isCalendar   = searchParams.get("view") === "calendar";

  const buildViewHref = (v: string) => {
    const p = new URLSearchParams(searchParams.toString());
    p.set("view", v);
    return `/?${p.toString()}`;
  };

  return (
    <header
      className="sticky top-0 z-40 backdrop-blur-sm border-b"
      style={{
        background: "color-mix(in srgb, var(--bg) 88%, transparent)",
        borderColor: "var(--border)",
      }}
    >
      <div className="w-full px-4 sm:px-6 lg:px-10 h-14 flex items-center gap-4">

        {/* Brand */}
        <Link href="/" className="flex items-center gap-2 min-w-0 shrink-0">
          <div className="flex flex-col leading-none">
            <span className="text-lg font-black tracking-tight" style={{ color: "var(--text)" }}>
              📢 eventundo
              <span style={{ color: "var(--text-faint)" }}>.in</span>
            </span>
            <span className="text-[11px] font-medium tracking-wide hidden sm:block"
              style={{ color: "var(--text-muted)" }}>
              ഇവന്റ് ഉണ്ടോ?
            </span>
          </div>
        </Link>

        {/* Events / Calendar toggle */}
        <div className="flex items-center gap-0.5 p-0.5 rounded-lg border"
          style={{ background: "var(--bg-subtle)", borderColor: "var(--border)" }}>
          <Link
            href={buildViewHref("list")}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-md transition-all"
            style={
              !isCalendar
                ? { background: "var(--bg-card)", color: "var(--text)", boxShadow: "0 1px 2px rgba(0,0,0,0.07)" }
                : { color: "var(--text-faint)" }
            }
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2}
                d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
            <span className="hidden sm:inline">Events</span>
          </Link>
          <Link
            href={buildViewHref("calendar")}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-md transition-all"
            style={
              isCalendar
                ? { background: "var(--bg-card)", color: "var(--text)", boxShadow: "0 1px 2px rgba(0,0,0,0.07)" }
                : { color: "var(--text-faint)" }
            }
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="hidden sm:inline">Calendar</span>
          </Link>
        </div>

        {/* Push right actions to far end */}
        <div className="flex-1" />

        {/* Right — Actions */}
        <div className="flex items-center gap-2">
          <LiveClock />
          <ThemeToggle />
          {isAdminPage && <AdminLogoutButton />}
          {!isSubmitPage && !isAdminPage && (
            <Link
              href="/submit"
              className="flex items-center gap-1.5 text-white text-sm font-semibold px-4 py-2 rounded-full min-h-[34px] transition-colors"
              style={{ background: "var(--accent)" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "var(--accent-hover)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "var(--accent)")}
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
              <span className="hidden sm:inline">Suggest an Event</span>
              <span className="sm:hidden">Suggest</span>
            </Link>
          )}
        </div>

      </div>
    </header>
  );
}
