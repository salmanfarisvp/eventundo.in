"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "./ThemeToggle";
import LiveClock from "./LiveClock";

export default function Header() {
  const pathname = usePathname();
  const isSubmitPage = pathname === "/submit";

  return (
    <header
      className="sticky top-0 z-40 backdrop-blur-sm border-b"
      style={{
        background: "color-mix(in srgb, var(--bg) 85%, transparent)",
        borderColor: "var(--border)",
      }}
    >
      <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between gap-3">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2 group min-w-0">
          <div className="flex flex-col leading-none">
            <span
              className="text-lg font-black tracking-tight transition-colors"
              style={{ color: "var(--text)" }}
            >
              eventundo
              <span style={{ color: "var(--text-faint)" }}>.in</span>
            </span>
            <span
              className="text-[11px] font-medium tracking-wide hidden sm:block"
              style={{ color: "var(--text-muted)" }}
            >
              ഇവന്റ് ഉണ്ടോ?
            </span>
          </div>
        </Link>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <LiveClock />
          <ThemeToggle />
          {!isSubmitPage && (
            <Link
              href="/submit"
              className="flex items-center gap-1.5 text-white text-sm font-semibold px-4 py-2 rounded-full min-h-[36px] transition-colors"
              style={{ background: "var(--accent)" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "var(--accent-hover)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "var(--accent)")
              }
            >
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M12 4v16m8-8H4"
                />
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
