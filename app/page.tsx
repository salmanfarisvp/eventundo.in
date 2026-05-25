import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import Header from "@/components/Header";
import EventCard from "@/components/EventCard";
import EventFilters from "@/components/EventFilters";
import CalendarView from "@/components/CalendarView";
import { SkeletonGrid } from "@/components/SkeletonCard";
import type { Database } from "@/lib/types";

type Event = Database["public"]["Tables"]["events"]["Row"];

interface HomePageProps {
  searchParams: Promise<{ district?: string; category?: string; view?: string }>;
}

async function EventFeed({ district, category }: { district?: string; category?: string }) {
  const supabase = await createClient();
  const today = new Date().toISOString().split("T")[0];

  let query = supabase
    .from("events")
    .select("*")
    .eq("status", "approved")
    .gte("event_date", today)
    .order("created_at", { ascending: false });

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
        <p className="text-4xl mb-4">🗓️</p>
        <p className="font-semibold text-base mb-1" style={{ color: "var(--text)" }}>
          ഒരു ഇവന്റും കണ്ടെത്തിയില്ല
        </p>
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          {district || category ? "ഫിൽട്ടർ മാറ്റി നോക്കൂ." : "ആദ്യത്തെ ഇവന്റ് submit ചെയ്യൂ!"}
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

async function CalendarFeed({ district, category }: { district?: string; category?: string }) {
  const supabase = await createClient();

  let query = supabase
    .from("events")
    .select("*")
    .eq("status", "approved")
    .order("event_date", { ascending: true });

  if (district) query = query.eq("district", district);
  if (category) query = query.eq("category", category);

  const { data: events } = await query;

  return <CalendarView events={(events ?? []) as Event[]} />;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams;
  const { district, category, view } = params;
  const isCalendar = view === "calendar";

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--bg)" }}>
      <Header />
      <main className="flex-1 w-full px-4 sm:px-6 lg:px-10 py-8 flex flex-col gap-6">

        {/* Hero */}
        <div className="pt-2">
          <h1 className="text-3xl font-black tracking-tight leading-tight" style={{ color: "var(--text)" }}>
            കേരളത്തിലെ ഇവന്റുകൾ
          </h1>
          <p className="text-base mt-1" style={{ color: "var(--text-muted)" }}>
            നിങ്ങൾക്കു സമീപമുള്ള പുതിയ ഇവന്റുകൾ കണ്ടെത്താനും പങ്കിടാനും ഒരു ലളിതമായ പ്ലാറ്റ്ഫോം.
          </p>
        </div>

        {/* Filters — only in list view */}
        {!isCalendar && (
          <Suspense fallback={
            <div className="h-9 w-48 rounded-xl animate-pulse" style={{ background: "var(--bg-subtle)" }} />
          }>
            <EventFilters />
          </Suspense>
        )}

        {/* Feed */}
        {isCalendar ? (
          <Suspense fallback={
            <div className="h-96 rounded-xl animate-pulse border"
              style={{ background: "var(--bg-card)", borderColor: "var(--border)" }} />
          }>
            <CalendarFeed district={district} category={category} />
          </Suspense>
        ) : (
          <Suspense fallback={<SkeletonGrid count={6} />}>
            <EventFeed district={district} category={category} />
          </Suspense>
        )}
      </main>

      <footer className="relative text-xs px-4 sm:px-6 lg:px-10 py-8 border-t mt-4 text-center"
        style={{ color: "var(--text-faint)", borderColor: "var(--border)" }}>
        <span>© {new Date().getFullYear()} eventundo.in</span>
        <a href="/archive"
          className="absolute right-4 sm:right-6 lg:right-10 top-1/2 -translate-y-1/2 flex items-center gap-1 transition-colors hover:underline"
          style={{ color: "var(--text-muted)" }}>
          Past Events
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </a>
      </footer>
    </div>
  );
}
