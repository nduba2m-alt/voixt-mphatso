import { createServiceClient } from "@/lib/supabase/server";
import ReportsClient from "./reports-client";

export default async function ReportsPage() {
  const supabase = await createServiceClient();
  const { data: orders } = await supabase.from("ticket_orders").select("*").order("created_at", { ascending: false });
  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl" style={{ color: "#F5F0E8" }}>REPORTS</h1>
      <ReportsClient orders={orders ?? []} />
    </div>
  );
}
