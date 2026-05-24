import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";
import SubmitForm from "@/components/SubmitForm";

export const metadata = {
  title: "Suggest an Event — eventundo.in",
  description: "Submit a local event for Kerala's community event directory.",
};

export default function SubmitPage() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--bg)" }}>
      <header className="border-b-2 sticky top-0 z-40"
        style={{ background: "var(--bg)", borderColor: "var(--border)" }}>
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group font-black text-lg tracking-tight"
            style={{ color: "var(--text)" }}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"
              style={{ color: "var(--text-muted)" }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
            eventundo<span style={{ color: "var(--accent)" }}>.in</span>
          </Link>
          <ThemeToggle />
        </div>
      </header>

      <main className="flex-1 max-w-lg mx-auto w-full px-4 py-8">
        <div className="border-2 p-4 mb-6"
          style={{ borderColor: "var(--border)", background: "var(--bg-card)", boxShadow: "var(--shadow)" }}>
          <h1 className="text-2xl font-black tracking-tight" style={{ color: "var(--text)" }}>
            ഒരു ഇവന്റ് Suggest ചെയ്യൂ
          </h1>
          <p className="text-sm font-medium mt-1" style={{ color: "var(--text-muted)" }}>
            Know a local event? Share it with Kerala. Free &amp; takes 30 seconds.
          </p>
        </div>

        <div className="border-2 p-5 sm:p-6"
          style={{ borderColor: "var(--border)", background: "var(--bg-card)", boxShadow: "var(--shadow)" }}>
          <SubmitForm />
        </div>

        <p className="text-xs font-bold text-center mt-5" style={{ color: "var(--text-faint)" }}>
          All submissions are reviewed by an admin before going live.
        </p>
      </main>
    </div>
  );
}
