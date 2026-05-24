"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { KERALA_DISTRICTS, EVENT_CATEGORIES } from "@/lib/constants";
import type { Database } from "@/lib/types";
import Link from "next/link";
import ThemeToggle from "./ThemeToggle";

type Event = Database["public"]["Tables"]["events"]["Row"];
type EditForm = {
  title: string; category: string; event_date: string;
  venue: string; district: string; maps_url: string; registration_url: string;
};

function formatDate(dateStr: string) {
  return new Date(dateStr + "T00:00:00").toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
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

/* ── Edit Modal ─────────────────────────────────────────────── */
function EditModal({ event, onClose, onSave }: {
  event: Event; onClose: () => void; onSave: (updated: Event) => void;
}) {
  const supabase = createClient();
  const [form, setForm] = useState<EditForm>({
    title: event.title, category: event.category ?? "",
    event_date: event.event_date, venue: event.venue, district: event.district,
    maps_url: event.maps_url ?? "", registration_url: event.registration_url ?? "",
  });
  const [saving, setSaving] = useState(false);
  const backdropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [onClose]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true);
    const updates = {
      title: form.title.trim(), category: form.category || null,
      event_date: form.event_date, venue: form.venue.trim(), district: form.district,
      maps_url: form.maps_url.trim() || null, registration_url: form.registration_url.trim() || null,
    };
    const { error } = await supabase.from("events").update(updates).eq("id", event.id);
    setSaving(false);
    if (error) { toast.error("Failed to save changes."); return; }
    onSave({ ...event, ...updates }); toast.success("Event updated."); onClose();
  };

  const Label = ({ children }: { children: React.ReactNode }) => (
    <label className="block text-xs font-black uppercase tracking-wider mb-1.5"
      style={{ color: "var(--text)" }}>{children}</label>
  );
  const fieldCls = "brutal-input w-full text-sm px-3 py-2.5 min-h-[44px]";

  return (
    <div ref={backdropRef} className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.6)" }}
      onClick={(e) => { if (e.target === backdropRef.current) onClose(); }}>
      <div className="w-full max-w-lg border-2 flex flex-col max-h-[90dvh]"
        style={{ background: "var(--bg-card)", borderColor: "var(--border)", boxShadow: "var(--shadow)" }}>
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b-2"
          style={{ borderColor: "var(--border)" }}>
          <h2 className="font-black text-base uppercase tracking-wide" style={{ color: "var(--text)" }}>
            Edit Event
          </h2>
          <button onClick={onClose}
            className="brutal-btn brutal-btn-ghost w-8 h-8 rounded-none">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSave} className="flex flex-col gap-4 p-5 overflow-y-auto">
          <div>
            <Label>Title *</Label>
            <input name="title" type="text" required value={form.title} onChange={handleChange} className={fieldCls} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Category</Label>
              <div className="relative">
                <select name="category" value={form.category} onChange={handleChange}
                  className={`${fieldCls} appearance-none pr-8 cursor-pointer`}>
                  <option value="">None</option>
                  {EVENT_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-2.5 flex items-center"
                  style={{ color: "var(--text-faint)" }}>
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
            <div>
              <Label>Date *</Label>
              <input name="event_date" type="date" required value={form.event_date} onChange={handleChange} className={fieldCls} />
            </div>
          </div>
          <div>
            <Label>Venue *</Label>
            <input name="venue" type="text" required value={form.venue} onChange={handleChange} className={fieldCls} />
          </div>
          <div>
            <Label>District *</Label>
            <div className="relative">
              <select name="district" required value={form.district} onChange={handleChange}
                className={`${fieldCls} appearance-none pr-8 cursor-pointer`}>
                <option value="">Select district</option>
                {KERALA_DISTRICTS.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-2.5 flex items-center"
                style={{ color: "var(--text-faint)" }}>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
          <div>
            <Label>Maps Link</Label>
            <input name="maps_url" type="url" value={form.maps_url} placeholder="https://maps.app.goo.gl/..."
              onChange={handleChange} className={fieldCls} />
          </div>
          <div>
            <Label>Registration / Info Link</Label>
            <input name="registration_url" type="url" value={form.registration_url} placeholder="https://..."
              onChange={handleChange} className={fieldCls} />
          </div>

          <div className="flex gap-3 pt-1 pb-1">
            <button type="button" onClick={onClose}
              className="brutal-btn brutal-btn-ghost flex-1 text-sm rounded-none min-h-[44px]">
              Cancel
            </button>
            <button type="submit" disabled={saving}
              className="brutal-btn brutal-btn-accent flex-1 text-sm rounded-none min-h-[44px] gap-2">
              {saving ? <><Spinner /> Saving...</> : "Save Changes →"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ── Main Dashboard ─────────────────────────────────────────── */
export default function AdminDashboard({ initialPending, initialApproved }: {
  initialPending: Event[]; initialApproved: Event[];
}) {
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
    setApproved((p) => [...p, { ...event, status: "approved" as const }]
      .sort((a, b) => new Date(a.event_date).getTime() - new Date(b.event_date).getTime()));
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
    if (updated.status === "pending") setPending((p) => p.map((e) => e.id === updated.id ? updated : e));
    else setApproved((p) => p.map((e) => e.id === updated.id ? updated : e));
  };

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      {editingEvent && (
        <EditModal event={editingEvent} onClose={() => setEditingEvent(null)} onSave={handleSaveEdit} />
      )}

      {/* Header */}
      <header className="border-b-2 sticky top-0 z-40"
        style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="font-black text-lg tracking-tight" style={{ color: "var(--text)" }}>
              eventundo<span style={{ color: "var(--accent)" }}>.in</span>
            </Link>
            <span className="text-xs font-black uppercase tracking-widest border-2 px-2 py-0.5"
              style={{ color: "var(--accent)", borderColor: "var(--accent)", background: "var(--accent-soft)" }}>
              Admin
            </span>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button onClick={async () => { await supabase.auth.signOut(); router.push("/admin/login"); }}
              className="brutal-btn brutal-btn-ghost text-sm px-3 py-2 rounded-none min-h-[36px] gap-1.5">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6">
        {/* Tabs */}
        <div className="flex gap-0 mb-6 border-2" style={{ borderColor: "var(--border)", width: "fit-content" }}>
          {(["pending", "live"] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className="px-5 py-2.5 text-sm font-black uppercase tracking-wide flex items-center gap-2 transition-colors min-h-[44px]"
              style={tab === t
                ? { background: "var(--accent)", color: "var(--accent-fg)", borderRight: t === "pending" ? `2px solid var(--border)` : "none" }
                : { background: "var(--bg-card)", color: "var(--text-muted)", borderRight: t === "pending" ? `2px solid var(--border)` : "none" }}>
              {t === "pending" ? "Pending" : "Live"}
              <span className="text-xs font-black px-1.5 py-0.5 border"
                style={tab === t
                  ? { background: "rgba(0,0,0,0.2)", color: "inherit", borderColor: "rgba(0,0,0,0.3)" }
                  : { background: "var(--bg-subtle)", color: "var(--text-faint)", borderColor: "var(--border)" }}>
                {t === "pending" ? pending.length : approved.length}
              </span>
            </button>
          ))}
        </div>

        {/* Pending */}
        {tab === "pending" && (
          <div className="flex flex-col gap-3">
            {pending.length === 0 ? (
              <div className="border-2 p-12 text-center"
                style={{ borderColor: "var(--border)", background: "var(--bg-card)", boxShadow: "var(--shadow)" }}>
                <p className="text-3xl mb-2">✅</p>
                <p className="font-black" style={{ color: "var(--text)" }}>All clear!</p>
                <p className="text-sm font-medium mt-1" style={{ color: "var(--text-muted)" }}>No pending submissions.</p>
              </div>
            ) : pending.map((event) => (
              <PendingRow key={event.id} event={event} processing={processingId === event.id}
                onApprove={() => handleApprove(event)} onReject={() => handleReject(event)}
                onEdit={() => setEditingEvent(event)} />
            ))}
          </div>
        )}

        {/* Live */}
        {tab === "live" && (
          <div className="flex flex-col gap-3">
            {approved.length === 0 ? (
              <div className="border-2 p-12 text-center"
                style={{ borderColor: "var(--border)", background: "var(--bg-card)", boxShadow: "var(--shadow)" }}>
                <p className="text-sm font-bold" style={{ color: "var(--text-muted)" }}>No live events yet.</p>
              </div>
            ) : approved.map((event) => (
              <LiveRow key={event.id} event={event} processing={processingId === event.id}
                onDelete={() => handleDelete(event)} onEdit={() => setEditingEvent(event)} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

/* ── Row components ─────────────────────────────────────────── */
function PendingRow({ event, processing, onApprove, onReject, onEdit }: {
  event: Event; processing: boolean;
  onApprove: () => void; onReject: () => void; onEdit: () => void;
}) {
  return (
    <div className="border-2 p-4 flex flex-col gap-3"
      style={{ background: "var(--bg-card)", borderColor: "var(--border)", boxShadow: "var(--shadow-sm)" }}>
      <div>
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <span className="font-black text-sm" style={{ color: "var(--text)" }}>{event.title}</span>
          {event.category && (
            <span className="brutal-badge" style={{ background: "var(--accent-soft)", color: "var(--accent-text)", borderColor: "var(--border)" }}>
              {event.category}
            </span>
          )}
        </div>
        <div className="text-xs font-medium flex flex-wrap gap-x-2 gap-y-0.5" style={{ color: "var(--text-faint)" }}>
          <span>{formatDate(event.event_date)}</span>
          <span>·</span><span>{event.venue}, {event.district}</span>
          {event.maps_url && (<><span>·</span>
            <a href={event.maps_url} target="_blank" rel="noopener noreferrer"
              className="hover:underline font-bold" style={{ color: "var(--accent)" }}>Maps</a></>)}
          {event.registration_url && (<><span>·</span>
            <a href={event.registration_url} target="_blank" rel="noopener noreferrer"
              className="hover:underline font-bold" style={{ color: "var(--accent)" }}>Register</a></>)}
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        <button onClick={onApprove} disabled={processing}
          className="brutal-btn brutal-btn-accent text-sm px-3.5 py-2 rounded-none min-h-[36px] gap-1.5">
          {processing ? <Spinner /> : <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>}
          Approve
        </button>
        <button onClick={onEdit} disabled={processing}
          className="brutal-btn brutal-btn-ghost text-sm px-3.5 py-2 rounded-none min-h-[36px] gap-1.5">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Edit
        </button>
        <button onClick={onReject} disabled={processing}
          className="brutal-btn brutal-btn-danger text-sm px-3.5 py-2 rounded-none min-h-[36px] gap-1.5">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          Reject
        </button>
      </div>
    </div>
  );
}

function LiveRow({ event, processing, onDelete, onEdit }: {
  event: Event; processing: boolean; onDelete: () => void; onEdit: () => void;
}) {
  return (
    <div className="border-2 p-4 flex flex-col gap-3"
      style={{ background: "var(--bg-card)", borderColor: "var(--border)", boxShadow: "var(--shadow-sm)" }}>
      <div>
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <span className="font-black text-sm" style={{ color: "var(--text)" }}>{event.title}</span>
          {event.category && (
            <span className="brutal-badge" style={{ background: "var(--accent-soft)", color: "var(--accent-text)", borderColor: "var(--border)" }}>
              {event.category}
            </span>
          )}
          <span className="brutal-badge" style={{ background: "#dcfce7", color: "#15803d", borderColor: "var(--border)" }}>
            ● Live
          </span>
        </div>
        <div className="text-xs font-medium flex flex-wrap gap-x-2 gap-y-0.5" style={{ color: "var(--text-faint)" }}>
          <span>{formatDate(event.event_date)}</span>
          <span>·</span><span>{event.venue}, {event.district}</span>
        </div>
      </div>
      <div className="flex gap-2">
        <button onClick={onEdit} disabled={processing}
          className="brutal-btn brutal-btn-ghost text-sm px-3.5 py-2 rounded-none min-h-[36px] gap-1.5">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Edit
        </button>
        <button onClick={onDelete} disabled={processing}
          className="brutal-btn brutal-btn-danger text-sm px-3.5 py-2 rounded-none min-h-[36px] gap-1.5">
          {processing ? <Spinner /> : <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>}
          Delete
        </button>
      </div>
    </div>
  );
}
