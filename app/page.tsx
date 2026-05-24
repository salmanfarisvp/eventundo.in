import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import Header from "@/components/Header";
import EventCard from "@/components/EventCard";
import EventFilters from "@/components/EventFilters";
import { SkeletonGrid } from "@/components/SkeletonCard";
import type { Database } from "@/lib/types";

type Event = Database["public"]["Tables"]["events"]["Row"];

interface HomePageProps {
  searchParams: Promise<{ district?: string; category?: string }>;
}

async function EventFeed({ district, category }: { district?: string; category?: string }) {
  const supabase = await createClient();
  const today = new Date().toISOString().split("T")[0];

  let query = supabase
    .from("events").select("*").eq("status", "approved")
    .gte("event_date", today).order("event_date", { ascending: true });

  if (district) query = query.eq("district", district);
  if (category) query = query.eq("category", category);

  const { data: events, error } = await query;

  if (error) return (
    <div className="text-center py-16 text-sm font-bold" style={{ color: "var(--text-muted)" }}>
      Unable to load events. Please try again.
    </div>
  );

  if (!events || events.length === 0) return (
    <div className="border-2 p-12 text-center"
      style={{ borderColor: "var(--border)", background: "var(--bg-card)", boxShadow: "var(--shadow)" }}>
      <p className="text-4xl mb-3">🗓️</p>
      <p className="font-black text-base mb-1" style={{ color: "var(--text)" }}>
        ഒരു ഇവന്റും കണ്ടെത്തിയില്ല
      </p>
      <p className="text-sm font-medium" style={{ color: "var(--text-muted)" }}>
        {district || category ? "ഫിൽട്ടർ മാറ്റി നോക്കൂ." : "ആദ്യത്തെ ഇവന്റ് submit ചെയ്യൂ!"}
      </p>
    </div>
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {(events as Event[]).map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams;
  const { district, category } = params;

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--bg)" }}>
      <Header />

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-8 flex flex-col gap-6">
        {/* Hero */}
        <div className="border-2 p-5" style={{ borderColor: "var(--border)", background: "var(--bg-card)", boxShadow: "var(--shadow)" }}>
          <h1 className="text-3xl font-black tracking-tight leading-tight" style={{ color: "var(--text)" }}>
            കേരളത്തിലെ ഇവന്റുകൾ
          </h1>
          <p className="text-sm font-bold mt-1" style={{ color: "var(--text-muted)" }}>
            ഉത്സവം · പ്രദർശനം · ടെക് · കായികം — ഒരൊറ്റ പേജിൽ
          </p>
        </div>

        {/* Filters */}
        <Suspense fallback={
          <div className="h-11 animate-pulse border-2"
            style={{ background: "var(--bg-subtle)", borderColor: "var(--border)" }} />
        }>
          <EventFilters />
        </Suspense>

        {/* Feed */}
        <Suspense fallback={<SkeletonGrid count={6} />}>
          <EventFeed district={district} category={category} />
        </Suspense>
      </main>

      <footer className="border-t-2 py-6 text-center text-xs font-bold"
        style={{ borderColor: "var(--border)", color: "var(--text-faint)", background: "var(--bg-card)" }}>
        © {new Date().getFullYear()} eventundo.in — കേരളത്തിന്, സ്നേഹത്തോടെ
      </footer>
    </div>
  );
}
