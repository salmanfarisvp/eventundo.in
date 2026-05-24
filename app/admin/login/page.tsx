"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import ThemeToggle from "@/components/ThemeToggle";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) { setError("Invalid email or password."); return; }
    router.push("/admin"); router.refresh();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4"
      style={{ background: "var(--bg)" }}>
      <div className="absolute top-4 right-4"><ThemeToggle /></div>

      <div className="w-full max-w-sm">
        <div className="border-2 p-4 mb-5 text-center"
          style={{ borderColor: "var(--border)", background: "var(--bg-card)", boxShadow: "var(--shadow)" }}>
          <span className="text-2xl font-black tracking-tight" style={{ color: "var(--text)" }}>
            eventundo<span style={{ color: "var(--accent)" }}>.in</span>
          </span>
          <p className="text-sm font-black mt-1 uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
            Admin Login
          </p>
        </div>

        <form onSubmit={handleLogin} className="border-2 p-6 flex flex-col gap-4"
          style={{ borderColor: "var(--border)", background: "var(--bg-card)", boxShadow: "var(--shadow)" }}>
          {error && (
            <div className="border-2 px-4 py-3 text-sm font-bold"
              style={{ borderColor: "#dc2626", background: "#fee2e2", color: "#dc2626" }}>
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-black uppercase tracking-wider mb-1.5"
              style={{ color: "var(--text)" }}>Email</label>
            <input type="email" required autoComplete="email" value={email}
              onChange={(e) => setEmail(e.target.value)} placeholder="admin@eventundo.in"
              className="brutal-input w-full text-sm px-3.5 py-3 min-h-[48px]" />
          </div>

          <div>
            <label className="block text-xs font-black uppercase tracking-wider mb-1.5"
              style={{ color: "var(--text)" }}>Password</label>
            <input type="password" required autoComplete="current-password" value={password}
              onChange={(e) => setPassword(e.target.value)} placeholder="••••••••"
              className="brutal-input w-full text-sm px-3.5 py-3 min-h-[48px]" />
          </div>

          <button type="submit" disabled={loading}
            className="brutal-btn brutal-btn-accent text-base rounded-none min-h-[52px] gap-2 mt-1">
            {loading ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Signing in...
              </>
            ) : "Sign In →"}
          </button>
        </form>
      </div>
    </div>
  );
}
