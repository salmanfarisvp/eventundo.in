import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import ThemeToggle from "@/components/ThemeToggle";
import ShareButton from "@/components/ShareButton";

interface EventPageProps {
  params: Promise<{ id: string }>;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr + "T00:00:00").toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function getDaysUntil(dateStr: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const eventDate = new Date(dateStr + "T00:00:00");
  return Math.ceil((eventDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

export async function generateMetadata({ params }: EventPageProps): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();
  const { data: event } = await supabase
    .from("events")
    .select("*")
    .eq("id", id)
    .eq("status", "approved")
    .single();

  if (!event) return { title: "Event not found — eventundo.in" };

  const description = `${formatDate(event.event_date)} · ${event.venue}, ${event.district}${event.category ? ` · ${event.category}` : ""}`;

  return {
    title: `${event.title} — eventundo.in`,
    description,
    openGraph: {
      title: event.title,
      description,
      url: `https://eventundo.in/events/${event.id}`,
      siteName: "eventundo.in",
      type: "article",
    },
    twitter: {
      card: "summary",
      title: event.title,
      description,
    },
  };
}

export default async function EventPage({ params }: EventPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: event } = await supabase
    .from("events")
    .select("*")
    .eq("id", id)
    .eq("status", "approved")
    .single();

  if (!event) notFound();

  const daysUntil = getDaysUntil(event.event_date);
  const isToday = daysUntil === 0;
  const isTomorrow = daysUntil === 1;
  const isPast = daysUntil < 0;

  const whatsappText = encodeURIComponent(
    `📅 ${event.title}\n📍 ${event.venue}, ${event.district}\n🗓 ${formatDate(event.event_date)}\n\neventundo.in/events/${event.id}`
  );

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--bg)" }}>
      {/* Header */}
      <header
        className="border-b sticky top-0 z-40 backdrop-blur-sm"
        style={{
          background: "color-mix(in srgb, var(--bg) 85%, transparent)",
          borderColor: "var(--border)",
        }}
      >
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <svg className="w-4 h-4 transition-opacity group-hover:opacity-60"
              fill="none" stroke="currentColor" viewBox="0 0 24 24"
              style={{ color: "var(--text-muted)" }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-lg font-black tracking-tight" style={{ color: "var(--text)" }}>
              eventundo<span style={{ color: "var(--text-faint)" }}>.in</span>
            </span>
          </Link>
          <ThemeToggle />
        </div>
      </header>

      <main className="flex-1 max-w-lg mx-auto w-full px-4 py-8">
        <article className="flex flex-col gap-6">
          {/* Category + status badges */}
          <div className="flex flex-wrap gap-2">
            {event.category && (
              <span
                className="text-xs font-semibold px-3 py-1 rounded-full"
                style={{ background: "var(--accent-soft)", color: "var(--accent-text)" }}
              >
                {event.category}
              </span>
            )}
            {isPast && (
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                Past event
              </span>
            )}
            {isToday && (
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400">
                Today
              </span>
            )}
            {isTomorrow && (
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400">
                Tomorrow
              </span>
            )}
            {!isPast && !isToday && !isTomorrow && daysUntil <= 7 && (
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400">
                In {daysUntil} days
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="text-2xl font-black leading-snug tracking-tight" style={{ color: "var(--text)" }}>
            {event.title}
          </h1>

          {/* Details card */}
          <div
            className="rounded-2xl border divide-y"
            style={{ borderColor: "var(--border)", background: "var(--bg-card)" }}
          >
            {/* Date */}
            <div className="flex items-center gap-4 px-5 py-4">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: "var(--accent-soft)" }}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  style={{ color: "var(--accent)" }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide mb-0.5"
                  style={{ color: "var(--text-faint)" }}>Date</p>
                <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>
                  {formatDate(event.event_date)}
                </p>
              </div>
            </div>

            {/* Venue */}
            <div className="flex items-center gap-4 px-5 py-4">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: "var(--accent-soft)" }}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  style={{ color: "var(--accent)" }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide mb-0.5"
                  style={{ color: "var(--text-faint)" }}>Venue</p>
                <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>
                  {event.venue}
                </p>
                <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                  {event.district}, Kerala
                </p>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col gap-2.5">
            {event.registration_url && (
              <a
                href={event.registration_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 text-white text-sm font-semibold px-4 py-3.5 rounded-xl min-h-[52px] transition-opacity hover:opacity-90"
                style={{ background: "var(--accent)" }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
                Register / More Info
              </a>
            )}

            {event.maps_url && (
              <a
                href={event.maps_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 text-sm font-semibold px-4 py-3.5 rounded-xl min-h-[52px] transition-colors border"
                style={{ background: "var(--bg-card)", color: "var(--text)", borderColor: "var(--border)" }}
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"
                  style={{ color: "var(--accent)" }}>
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                </svg>
                Open in Google Maps
              </a>
            )}

            <a
              href={`https://wa.me/?text=${whatsappText}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 text-white text-sm font-semibold px-4 py-3.5 rounded-xl min-h-[52px] transition-opacity hover:opacity-90"
              style={{ background: "#25D366" }}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Share on WhatsApp
            </a>

            <ShareButton eventId={event.id} title={event.title} />
          </div>

          {/* Back link */}
          <Link
            href="/"
            className="text-sm text-center transition-opacity hover:opacity-70"
            style={{ color: "var(--text-faint)" }}
          >
            ← See all events
          </Link>
        </article>
      </main>
    </div>
  );
}
