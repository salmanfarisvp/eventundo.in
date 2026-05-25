import { Suspense } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import Header from "@/components/Header";
import EventCard from "@/components/EventCard";
import EventFilters from "@/components/EventFilters";
import { SkeletonGrid } from "@/components/SkeletonCard";
import type { Database } from "@/lib/types";

type Event = Database["public"]["Tables"]["events"]["Row"];

interface ArchivePageProps {
  searchParams: Promise<{ district?: string; category?: string }>;
}

async function ArchiveFeed({ district, category }: { district?: string; category?: string }) {
  const supabase = await createClient();
  const today = new Date().toISOString().split("T")[0];

  let query = supabase
    .from("events")
    .select("*")
    .eq("status", "approved")
    .lt("event_date", today)
    .order("event_date", { ascending: false });

  if (district) query = query.eq("district", district);
  if (category) query = query.eq("category", category);

  const { data: events, error } = await query;

  if (error) {
    return (
      <div className="text-center py-16 text-sm" style={{ color: "var(--text-muted)" }}>
        Unable to load events. Please try again.
      </div>
    );
  }

  if (!events || events.length === 0) {
    return (
      <div className="text-center py-20 px-4">
        <p className="text-4xl mb-4">📦</p>
        <p className="font-semibold text-base mb-1" style={{ color: "var(--text)" }}>
          No past events found
        </p>
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          {district || category ? "Try changing the filters." : "Past events will appear here."}
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-3 items-start" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))" }}>
      {(events as Event[]).map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
}

export default async function ArchivePage({ searchParams }: ArchivePageProps) {
  const params = await searchParams;
  const { district, category } = params;

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--bg)" }}>
      <Header />
      <main className="flex-1 w-full px-4 sm:px-6 lg:px-10 py-8 flex flex-col gap-6">

        {/* Hero */}
        <div className="pt-2 flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl font-black tracking-tight leading-tight" style={{ color: "var(--text)" }}>
              Past Events
            </h1>
            <p className="text-base mt-1" style={{ color: "var(--text-muted)" }}>
              കഴിഞ്ഞ ഇവന്റുകൾ — events that have already taken place
            </p>
          </div>
          <Link href="/"
            className="flex items-center gap-1.5 text-sm font-medium mt-1 transition-colors hover:underline"
            style={{ color: "var(--accent)" }}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Upcoming Events
          </Link>
        </div>

        {/* Filters */}
        <Suspense fallback={
          <div className="h-9 w-48 rounded-xl animate-pulse" style={{ background: "var(--bg-subtle)" }} />
        }>
          <EventFilters />
        </Suspense>

        {/* Feed */}
        <Suspense fallback={<SkeletonGrid count={6} />}>
          <ArchiveFeed district={district} category={category} />
        </Suspense>
      </main>

      <footer className="text-center text-xs py-8 border-t mt-4"
        style={{ color: "var(--text-faint)", borderColor: "var(--border)" }}>
        © {new Date().getFullYear()} eventundo.in — കേരളത്തിന്, സ്നേഹത്തോടെ
      </footer>
    </div>
  );
}
