"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { KERALA_DISTRICTS, EVENT_CATEGORIES } from "@/lib/constants";
import type { Database } from "@/lib/types";
import Link from "next/link";
import Header from "./Header";

type Event = Database["public"]["Tables"]["events"]["Row"];

type EditForm = {
  title: string;
  category: string;
  event_date: string;
  venue: string;
  district: string;
  maps_url: string;
  registration_url: string;
};

function formatDate(dateStr: string) {
  return new Date(dateStr + "T00:00:00").toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function Spinner() {
  return (
    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}

/* ─── Edit Modal ─────────────────────────────────────────────── */
function EditModal({
  event,
  onClose,
  onSave,
}: {
  event: Event;
  onClose: () => void;
  onSave: (updated: Event) => void;
}) {
  const supabase = createClient();
  const [form, setForm] = useState<EditForm>({
    title: event.title,
    category: event.category ?? "",
    event_date: event.event_date,
    venue: event.venue,
    district: event.district,
    maps_url: event.maps_url ?? "",
    registration_url: event.registration_url ?? "",
  });
  const [saving, setSaving] = useState(false);
  const backdropRef = useRef<HTMLDivElement>(null);

  // Close on Escape key
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const updates = {
      title: form.title.trim(),
      category: form.category || null,
      event_date: form.event_date,
      venue: form.venue.trim(),
      district: form.district,
      maps_url: form.maps_url.trim() || null,
      registration_url: form.registration_url.trim() || null,
    };

    const { error } = await supabase.from("events").update(updates).eq("id", event.id);
    setSaving(false);

    if (error) { toast.error("Failed to save changes."); return; }

    onSave({ ...event, ...updates });
    toast.success("Event updated.");
    onClose();
  };

  const fieldClass = "w-full text-sm px-3.5 py-2.5 rounded-xl border focus:outline-none transition-colors min-h-[44px]";
  const fieldStyle = { background: "var(--bg)", color: "var(--text)", borderColor: "var(--border)" };
  const labelStyle = { color: "var(--text)", display: "block", fontSize: "0.75rem", fontWeight: 600, marginBottom: "0.375rem", textTransform: "uppercase" as const, letterSpacing: "0.05em" };

  return (
    <div
      ref={backdropRef}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}
      onClick={(e) => { if (e.target === backdropRef.current) onClose(); }}
    >
      <div
        className="w-full max-w-lg rounded-2xl border shadow-xl flex flex-col max-h-[90dvh]"
        style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}
      >
        {/* Modal header */}
        <div className="flex items-center justify-between px-5 py-4 border-b shrink-0"
          style={{ borderColor: "var(--border)" }}>
          <h2 className="font-bold text-base" style={{ color: "var(--text)" }}>Edit Event</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg transition-opacity hover:opacity-60"
            style={{ color: "var(--text-muted)" }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scrollable form body */}
        <form onSubmit={handleSave} className="flex flex-col gap-4 p-5 overflow-y-auto">
          {/* Title */}
          <div>
            <label style={labelStyle}>Title *</label>
            <input name="title" type="text" required value={form.title}
              onChange={handleChange} className={fieldClass} style={fieldStyle} />
          </div>

          {/* Category + Date */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label style={labelStyle}>Category</label>
              <div className="relative">
                <select name="category" value={form.category} onChange={handleChange}
                  className={`${fieldClass} appearance-none pr-8 cursor-pointer`} style={fieldStyle}>
                  <option value="">None</option>
                  {EVENT_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-2.5 flex items-center"
                  style={{ color: "var(--text-faint)" }}>
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
            <div>
              <label style={labelStyle}>Date *</label>
              <input name="event_date" type="date" required value={form.event_date}
                onChange={handleChange} className={fieldClass} style={fieldStyle} />
            </div>
          </div>

          {/* Venue */}
          <div>
            <label style={labelStyle}>Venue *</label>
            <input name="venue" type="text" required value={form.venue}
              onChange={handleChange} className={fieldClass} style={fieldStyle} />
          </div>

          {/* District */}
          <div>
            <label style={labelStyle}>District *</label>
            <div className="relative">
              <select name="district" required value={form.district} onChange={handleChange}
                className={`${fieldClass} appearance-none pr-8 cursor-pointer`} style={fieldStyle}>
                <option value="">Select district</option>
                {KERALA_DISTRICTS.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-2.5 flex items-center"
                style={{ color: "var(--text-faint)" }}>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Maps URL */}
          <div>
            <label style={labelStyle}>Google Maps Link</label>
            <input name="maps_url" type="url" value={form.maps_url}
              placeholder="https://maps.app.goo.gl/..."
              onChange={handleChange} className={fieldClass} style={fieldStyle} />
          </div>

          {/* Registration URL */}
          <div>
            <label style={labelStyle}>Registration / More Info Link</label>
            <input name="registration_url" type="url" value={form.registration_url}
              placeholder="https://..."
              onChange={handleChange} className={fieldClass} style={fieldStyle} />
          </div>

          {/* Footer buttons */}
          <div className="flex gap-2.5 pt-1 pb-1">
            <button type="button" onClick={onClose}
              className="flex-1 text-sm font-semibold py-2.5 rounded-xl border min-h-[44px] transition-opacity hover:opacity-70"
              style={{ color: "var(--text-muted)", borderColor: "var(--border)", background: "transparent" }}>
              Cancel
            </button>
            <button type="submit" disabled={saving}
              className="flex-1 flex items-center justify-center gap-2 text-white text-sm font-semibold py-2.5 rounded-xl min-h-[44px] transition-opacity disabled:opacity-60"
              style={{ background: "var(--accent)" }}>
              {saving ? <><Spinner /> Saving...</> : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ─── Main Dashboard ─────────────────────────────────────────── */
interface AdminDashboardProps {
  initialPending: Event[];
  initialApproved: Event[];
}

export default function AdminDashboard({ initialPending, initialApproved }: AdminDashboardProps) {
  const [tab, setTab] = useState<"pending" | "live">("pending");
  const [pending, setPending] = useState<Event[]>(initialPending);
  const [approved, setApproved] = useState<Event[]>(initialApproved);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const handleApprove = async (event: Event) => {
    setProcessingId(event.id);
    const { error } = await supabase.from("events").update({ status: "approved" }).eq("id", event.id);
    setProcessingId(null);
    if (error) { toast.error("Failed to approve."); return; }
    setPending((p) => p.filter((e) => e.id !== event.id));
    setApproved((p) =>
      [...p, { ...event, status: "approved" as const }].sort(
        (a, b) => new Date(a.event_date).getTime() - new Date(b.event_date).getTime()
      )
    );
    toast.success(`"${event.title}" is now live!`);
  };

  const handleReject = async (event: Event) => {
    setProcessingId(event.id);
    const { error } = await supabase.from("events").delete().eq("id", event.id);
    setProcessingId(null);
    if (error) { toast.error("Failed to reject."); return; }
    setPending((p) => p.filter((e) => e.id !== event.id));
    toast.success(`"${event.title}" rejected.`);
  };

  const handleDelete = async (event: Event) => {
    setProcessingId(event.id);
    const { error } = await supabase.from("events").delete().eq("id", event.id);
    setProcessingId(null);
    if (error) { toast.error("Failed to delete."); return; }
    setApproved((p) => p.filter((e) => e.id !== event.id));
    toast.success(`"${event.title}" removed.`);
  };

  const handleSaveEdit = (updated: Event) => {
    if (updated.status === "pending") {
      setPending((p) => p.map((e) => e.id === updated.id ? updated : e));
    } else {
      setApproved((p) => p.map((e) => e.id === updated.id ? updated : e));
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--bg)" }}>
      {/* Edit modal */}
      {editingEvent && (
        <EditModal
          event={editingEvent}
          onClose={() => setEditingEvent(null)}
          onSave={handleSaveEdit}
        />
      )}

      <Header />

      <main className="flex-1 w-full px-4 sm:px-6 lg:px-10 py-6 max-w-2xl mx-auto">
        {/* Page heading */}
        <div className="mb-6">
          <h1 className="text-2xl font-black tracking-tight" style={{ color: "var(--text)" }}>Admin</h1>
          <p className="text-sm mt-0.5" style={{ color: "var(--text-muted)" }}>Manage event submissions</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 rounded-xl mb-6 w-fit" style={{ background: "var(--bg-subtle)" }}>
          {(["pending", "live"] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className="px-4 py-2 rounded-lg text-sm font-semibold transition-all min-h-[36px] flex items-center gap-2"
              style={tab === t
                ? { background: "var(--bg-card)", color: "var(--text)", boxShadow: "0 1px 3px rgba(0,0,0,.1)" }
                : { color: "var(--text-muted)" }}>
              {t === "pending" ? "Pending" : "Live"}
              <span className="text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center"
                style={t === "pending"
                  ? { background: pending.length > 0 ? "var(--accent)" : "var(--bg-subtle)", color: pending.length > 0 ? "white" : "var(--text-faint)" }
                  : { background: "var(--accent-soft)", color: "var(--accent-text)" }}>
                {t === "pending" ? pending.length : approved.length}
              </span>
            </button>
          ))}
        </div>

        {/* Pending tab */}
        {tab === "pending" && (
          <div className="flex flex-col gap-2.5">
            {pending.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-3xl mb-3">✅</p>
                <p className="font-semibold" style={{ color: "var(--text)" }}>All clear!</p>
                <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>No pending submissions.</p>
              </div>
            ) : (
              pending.map((event) => (
                <PendingRow
                  key={event.id}
                  event={event}
                  processing={processingId === event.id}
                  onApprove={() => handleApprove(event)}
                  onReject={() => handleReject(event)}
                  onEdit={() => setEditingEvent(event)}
                />
              ))
            )}
          </div>
        )}

        {/* Live tab */}
        {tab === "live" && (
          <div className="flex flex-col gap-2.5">
            {approved.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-sm" style={{ color: "var(--text-muted)" }}>No live events yet.</p>
              </div>
            ) : (
              approved.map((event) => (
                <LiveRow
                  key={event.id}
                  event={event}
                  processing={processingId === event.id}
                  onDelete={() => handleDelete(event)}
                  onEdit={() => setEditingEvent(event)}
                />
              ))
            )}
          </div>
        )}
      </main>

      <footer className="relative text-xs px-4 sm:px-6 lg:px-10 py-8 border-t mt-4 text-center"
        style={{ color: "var(--text-faint)", borderColor: "var(--border)" }}>
        © {new Date().getFullYear()} eventundo.in — കേരളത്തിന്, സ്നേഹത്തോടെ
        <Link href="/" className="absolute right-4 sm:right-6 lg:right-10 top-1/2 -translate-y-1/2 flex items-center gap-1 transition-colors hover:underline"
          style={{ color: "var(--text-muted)" }}>
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Home
        </Link>
      </footer>
    </div>
  );
}

/* ─── Row components ─────────────────────────────────────────── */
function PendingRow({
  event, processing, onApprove, onReject, onEdit,
}: {
  event: Event; processing: boolean;
  onApprove: () => void; onReject: () => void; onEdit: () => void;
}) {
  return (
    <div className="rounded-xl border p-4 flex flex-col gap-3"
      style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>
      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <span className="font-semibold text-sm" style={{ color: "var(--text)" }}>{event.title}</span>
          {event.category && (
            <span className="text-xs font-medium px-2 py-0.5 rounded-full shrink-0"
              style={{ background: "var(--accent-soft)", color: "var(--accent-text)" }}>
              {event.category}
            </span>
          )}
        </div>
        <div className="text-xs flex flex-wrap gap-x-2 gap-y-0.5" style={{ color: "var(--text-faint)" }}>
          <span>{formatDate(event.event_date)}</span>
          <span>·</span>
          <span>{event.venue}, {event.district}</span>
          {event.maps_url && (<>
            <span>·</span>
            <a href={event.maps_url} target="_blank" rel="noopener noreferrer"
              className="hover:underline" style={{ color: "var(--accent)" }}>Maps</a>
          </>)}
          {event.registration_url && (<>
            <span>·</span>
            <a href={event.registration_url} target="_blank" rel="noopener noreferrer"
              className="hover:underline" style={{ color: "var(--accent)" }}>Register</a>
          </>)}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-2">
        <button onClick={onApprove} disabled={processing}
          className="flex items-center gap-1.5 text-white text-sm font-semibold px-3.5 py-2 rounded-lg min-h-[36px] transition-opacity disabled:opacity-60"
          style={{ background: "var(--accent)" }}>
          {processing ? <Spinner /> : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          )}
          Approve
        </button>

        <button onClick={onEdit} disabled={processing}
          className="flex items-center gap-1.5 text-sm font-semibold px-3.5 py-2 rounded-lg min-h-[36px] border transition-opacity disabled:opacity-60"
          style={{ color: "var(--text)", borderColor: "var(--border)", background: "transparent" }}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Edit
        </button>

        <button onClick={onReject} disabled={processing}
          className="flex items-center gap-1.5 text-sm font-semibold px-3.5 py-2 rounded-lg min-h-[36px] border transition-opacity disabled:opacity-60"
          style={{ color: "var(--text-muted)", borderColor: "var(--border)", background: "transparent" }}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          Reject
        </button>
      </div>
    </div>
  );
}

function LiveRow({
  event, processing, onDelete, onEdit,
}: {
  event: Event; processing: boolean;
  onDelete: () => void; onEdit: () => void;
}) {
  return (
    <div className="rounded-xl border p-4 flex flex-col gap-3"
      style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>
      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <span className="font-semibold text-sm" style={{ color: "var(--text)" }}>{event.title}</span>
          {event.category && (
            <span className="text-xs font-medium px-2 py-0.5 rounded-full shrink-0"
              style={{ background: "var(--accent-soft)", color: "var(--accent-text)" }}>
              {event.category}
            </span>
          )}
          <span className="flex items-center gap-1 text-xs shrink-0" style={{ color: "var(--accent)" }}>
            <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: "var(--accent)" }} />
            Live
          </span>
        </div>
        <div className="text-xs flex flex-wrap gap-x-2 gap-y-0.5" style={{ color: "var(--text-faint)" }}>
          <span>{formatDate(event.event_date)}</span>
          <span>·</span>
          <span>{event.venue}, {event.district}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button onClick={onEdit} disabled={processing}
          className="flex items-center gap-1.5 text-sm font-semibold px-3.5 py-2 rounded-lg min-h-[36px] border transition-opacity disabled:opacity-60"
          style={{ color: "var(--text)", borderColor: "var(--border)", background: "transparent" }}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Edit
        </button>

        <button onClick={onDelete} disabled={processing}
          className="flex items-center gap-1.5 text-sm font-semibold px-3.5 py-2 rounded-lg min-h-[36px] border transition-opacity disabled:opacity-60"
          style={{ color: "var(--text-muted)", borderColor: "var(--border)", background: "transparent" }}>
          {processing ? <Spinner /> : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          )}
          Delete
        </button>
      </div>
    </div>
  );
}
