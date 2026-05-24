import { createClient } from "@/lib/supabase/server";
import AdminDashboard from "@/components/AdminDashboard";

export default async function AdminPage() {
  const supabase = await createClient();

  const [{ data: pending }, { data: approved }] = await Promise.all([
    supabase
      .from("events")
      .select("*")
      .eq("status", "pending")
      .order("created_at", { ascending: false }),
    supabase
      .from("events")
      .select("*")
      .eq("status", "approved")
      .order("event_date", { ascending: true }),
  ]);

  return (
    <AdminDashboard
      initialPending={pending ?? []}
      initialApproved={approved ?? []}
    />
  );
}
