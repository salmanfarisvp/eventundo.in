import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";
import SubmitForm from "@/components/SubmitForm";

export const metadata = {
  title: "Suggest an Event — eventundo.in",
  description: "Submit a local event for Kerala's community event directory.",
};

export default function SubmitPage() {
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "var(--bg)" }}
    >
      {/* Header */}
      <header
        className="border-b sticky top-0 z-40 backdrop-blur-sm"
        style={{
          background: "color-mix(in srgb, var(--bg) 85%, transparent)",
          borderColor: "var(--border)",
        }}
      >
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="group flex items-center gap-1.5">
            <svg
              className="w-4 h-4 transition-opacity group-hover:opacity-60"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              style={{ color: "var(--text-muted)" }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            <span
              className="text-lg font-black tracking-tight"
              style={{ color: "var(--text)" }}
            >
              eventundo
              <span style={{ color: "var(--text-faint)" }}>.in</span>
            </span>
          </Link>
          <ThemeToggle />
        </div>
      </header>

      <main className="flex-1 max-w-lg mx-auto w-full px-4 py-8">
        <div className="mb-6">
          <h1
            className="text-2xl font-black tracking-tight"
            style={{ color: "var(--text)" }}
          >
            ഒരു ഇവന്റ് Suggest ചെയ്യൂ
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
            Know a local event? Share it with Kerala. Free & takes 30 seconds.
          </p>
        </div>

        <div
          className="rounded-2xl border p-5 sm:p-6"
          style={{
            background: "var(--bg-card)",
            borderColor: "var(--border)",
          }}
        >
          <SubmitForm />
        </div>

        <p
          className="text-xs text-center mt-5"
          style={{ color: "var(--text-faint)" }}
        >
          All submissions are reviewed by an admin before going live.
        </p>
      </main>
    </div>
  );
}
