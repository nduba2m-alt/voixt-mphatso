import { createServiceClient } from "@/lib/supabase/server";
import OrdersTable from "./orders-table";

export const dynamic = "force-dynamic";

export default async function OrdersPage() {
  const supabase = await createServiceClient();
  const { data: orders } = await supabase
    .from("ticket_orders")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl" style={{ color: "#F5F0E8" }}>ORDERS</h1>
      <OrdersTable initialOrders={orders ?? []} />
    </div>
  );
}
