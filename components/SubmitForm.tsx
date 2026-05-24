"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { KERALA_DISTRICTS, EVENT_CATEGORIES } from "@/lib/constants";

interface FormData {
  title: string; category: string; event_date: string;
  venue: string; district: string; maps_url: string; registration_url: string;
}

const initialForm: FormData = {
  title: "", category: "", event_date: "",
  venue: "", district: "", maps_url: "", registration_url: "",
};

export default function SubmitForm() {
  const [form, setForm] = useState<FormData>(initialForm);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.from("events").insert({
      title: form.title.trim(), category: form.category || null,
      event_date: form.event_date, venue: form.venue.trim(),
      district: form.district,
      maps_url: form.maps_url.trim() || null,
      registration_url: form.registration_url.trim() || null,
      status: "pending",
    });
    setLoading(false);
    if (error) { toast.error("Something went wrong. Please try again."); return; }
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center text-center py-8 gap-4">
        <div className="w-14 h-14 border-2 flex items-center justify-center"
          style={{ background: "var(--accent-soft)", borderColor: "var(--border)", boxShadow: "var(--shadow-sm)" }}>
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"
            style={{ color: "var(--accent)" }}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div>
          <h2 className="text-xl font-black mb-1" style={{ color: "var(--text)" }}>✅ Submitted!</h2>
          <p className="text-sm font-medium leading-relaxed" style={{ color: "var(--text-muted)" }}>
            നന്ദി! Admin verify ചെയ്തതിന് ശേഷം live ആകും.
          </p>
        </div>
        <div className="flex flex-col gap-2 w-full">
          <button onClick={() => { setForm(initialForm); setSubmitted(false); }}
            className="brutal-btn brutal-btn-accent text-sm py-2.5 rounded-none min-h-[44px]">
            മറ്റൊന്ന് submit ചെയ്യൂ
          </button>
          <button onClick={() => router.push("/")}
            className="brutal-btn brutal-btn-ghost text-sm py-2.5 rounded-none min-h-[44px]">
            Back to home
          </button>
        </div>
      </div>
    );
  }

  const Label = ({ children }: { children: React.ReactNode }) => (
    <label className="block text-xs font-black uppercase tracking-wider mb-1.5"
      style={{ color: "var(--text)" }}>{children}</label>
  );
  const Req = () => <span style={{ color: "var(--accent)" }}> *</span>;
  const fieldCls = "brutal-input w-full text-sm px-3.5 py-3 min-h-[48px]";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div>
        <Label>Event Title<Req /></Label>
        <input name="title" type="text" required placeholder="Event title"
          value={form.title} onChange={handleChange} className={fieldCls} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label>Category</Label>
          <div className="relative">
            <select name="category" value={form.category} onChange={handleChange}
              className={`${fieldCls} appearance-none pr-9 cursor-pointer`}>
              <option value="">Select category</option>
              {EVENT_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center"
              style={{ color: "var(--text-faint)" }}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
        <div>
          <Label>Event Date<Req /></Label>
          <input name="event_date" type="date" required
            min={new Date().toISOString().split("T")[0]}
            value={form.event_date} onChange={handleChange} className={fieldCls} />
        </div>
      </div>

      <div>
        <Label>Venue<Req /></Label>
        <input name="venue" type="text" required placeholder="Venue name"
          value={form.venue} onChange={handleChange} className={fieldCls} />
      </div>

      <div>
        <Label>District<Req /></Label>
        <div className="relative">
          <select name="district" required value={form.district} onChange={handleChange}
            className={`${fieldCls} appearance-none pr-9 cursor-pointer`}>
            <option value="">Select district</option>
            {KERALA_DISTRICTS.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center"
            style={{ color: "var(--text-faint)" }}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      <div>
        <Label>Google Maps Link<Req /></Label>
        <input name="maps_url" type="url" required placeholder="https://maps.app.goo.gl/..."
          value={form.maps_url} onChange={handleChange} className={fieldCls} />
      </div>

      <div>
        <Label>Registration / More Info Link<Req /></Label>
        <input name="registration_url" type="url" required placeholder="https://..."
          value={form.registration_url} onChange={handleChange} className={fieldCls} />
        <p className="text-xs font-medium mt-1.5" style={{ color: "var(--text-faint)" }}>
          Link to register, buy tickets, or get more details
        </p>
      </div>

      <button type="submit" disabled={loading}
        className="brutal-btn brutal-btn-accent text-base rounded-none min-h-[52px] gap-2">
        {loading ? (
          <>
            <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Submitting...
          </>
        ) : "Submit Event →"}
      </button>
    </form>
  );
}
