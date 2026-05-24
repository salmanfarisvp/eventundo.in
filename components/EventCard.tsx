import Link from "next/link";
import ShareButton from "./ShareButton";
import type { Database } from "@/lib/types";

type Event = Database["public"]["Tables"]["events"]["Row"];

function formatDate(dateStr: string): string {
  return new Date(dateStr + "T00:00:00").toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getDaysUntil(dateStr: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const eventDate = new Date(dateStr + "T00:00:00");
  return Math.ceil((eventDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

export default function EventCard({ event }: { event: Event }) {
  const daysUntil = getDaysUntil(event.event_date);
  const isToday    = daysUntil === 0;
  const isTomorrow = daysUntil === 1;
  const isExpired  = daysUntil < 0;

  const whatsappText = encodeURIComponent(
    `📅 ${event.title}\n📍 ${event.venue}, ${event.district}\n🗓 ${formatDate(event.event_date)}\n\neventundo.in/events/${event.id}`
  );

  return (
    <article className="brutal-card flex flex-col gap-3 p-4">
      {/* Top row */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-wrap gap-1.5">
          {event.category && (
            <span className="brutal-badge" style={{ background: "var(--accent-soft)", color: "var(--accent-text)", borderColor: "var(--border)" }}>
              {event.category}
            </span>
          )}
          {isExpired && (
            <span className="brutal-badge" style={{ background: "var(--bg-subtle)", color: "var(--text-faint)", borderColor: "var(--border)" }}>
              Expired
            </span>
          )}
          {isToday && (
            <span className="brutal-badge" style={{ background: "#dcfce7", color: "#15803d", borderColor: "var(--border)" }}>
              Today
            </span>
          )}
          {isTomorrow && (
            <span className="brutal-badge" style={{ background: "#dbeafe", color: "#1d4ed8", borderColor: "var(--border)" }}>
              Tomorrow
            </span>
          )}
          {!isExpired && !isToday && !isTomorrow && daysUntil <= 7 && (
            <span className="brutal-badge" style={{ background: "#fef9c3", color: "#92400e", borderColor: "var(--border)" }}>
              {daysUntil} days left
            </span>
          )}
        </div>

        {/* Icon actions */}
        <div className="flex items-center gap-1 shrink-0">
          <ShareButton eventId={event.id} title={event.title} compact />
          <a href={`https://wa.me/?text=${whatsappText}`} target="_blank" rel="noopener noreferrer"
            title="Share on WhatsApp"
            className="w-8 h-8 flex items-center justify-center border-2 transition-all hover:translate-x-[2px] hover:translate-y-[2px]"
            style={{ background: "var(--bg-card)", borderColor: "var(--border)", color: "var(--text-muted)", boxShadow: "var(--shadow-xs)" }}>
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
          </a>
        </div>
      </div>

      {/* Title */}
      <Link href={`/events/${event.id}`} className="group">
        <h2 className="font-black text-base leading-snug group-hover:underline decoration-2 underline-offset-2"
          style={{ color: "var(--text)" }}>
          {event.title}
        </h2>
      </Link>

      {/* Meta */}
      <div className="flex flex-col gap-1.5 text-sm" style={{ color: "var(--text-muted)" }}>
        <div className="flex items-center gap-2">
          <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"
            style={{ color: "var(--accent)" }}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="font-bold" style={{ color: "var(--text)" }}>{formatDate(event.event_date)}</span>
        </div>
        <div className="flex items-start gap-2">
          <svg className="w-3.5 h-3.5 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"
            style={{ color: "var(--accent)" }}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="font-medium">
            {event.venue}
            <span style={{ color: "var(--text-faint)" }}>, {event.district}</span>
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-2 mt-auto pt-1">
        {event.registration_url && (
          <a href={event.registration_url} target="_blank" rel="noopener noreferrer"
            className="brutal-btn brutal-btn-accent text-sm px-3 py-2.5 gap-2 rounded-none min-h-[44px]">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
            Register / More Info
          </a>
        )}
        <div className="flex gap-2">
          {event.maps_url && (
            <a href={event.maps_url} target="_blank" rel="noopener noreferrer"
              className="brutal-btn brutal-btn-ghost flex-1 text-sm px-3 py-2.5 gap-1.5 rounded-none min-h-[44px]">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" style={{ color: "var(--accent)" }}>
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
              </svg>
              Maps
            </a>
          )}
          <ShareButton eventId={event.id} title={event.title} />
        </div>
      </div>
    </article>
  );
}
