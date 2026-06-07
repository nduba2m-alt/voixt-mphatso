import { createServiceClient } from "@/lib/supabase/server";
import DashboardCharts from "./dashboard-charts";
import { Ticket, DollarSign, Clock, UserCheck } from "lucide-react";

async function getStats() {
  try {
    const supabase = await createServiceClient();
    const { data: orders } = await supabase.from("ticket_orders").select("status, amount, quantity, created_at");
    if (!orders) return { sold: 0, revenue: 0, pending: 0, checkedIn: 0, chartData: [] };

    const approved = orders.filter((o) => o.status === "approved" || o.status === "checked_in");
    const sold = approved.reduce((sum, o) => sum + (o.quantity ?? 1), 0);
    const revenue = approved.reduce((sum, o) => sum + Number(o.amount), 0);
    const pending = orders.filter((o) => o.status === "pending").length;

    const { data: tickets } = await supabase
      .from("tickets")
      .select("checked_in, checked_in_at")
      .eq("checked_in", true);
    const today = new Date().toDateString();
    const checkedIn = tickets?.filter((t) => t.checked_in_at && new Date(t.checked_in_at).toDateString() === today).length ?? 0;

    // Last 14 days sales
    const dayMap: Record<string, number> = {};
    approved.forEach((o) => {
      const day = new Date(o.created_at).toLocaleDateString("en-ZM", { month: "short", day: "numeric" });
      dayMap[day] = (dayMap[day] ?? 0) + (o.quantity ?? 1);
    });
    const chartData = Object.entries(dayMap).map(([date, count]) => ({ date, count }));

    return { sold, revenue, pending, checkedIn, chartData };
  } catch {
    return { sold: 0, revenue: 0, pending: 0, checkedIn: 0, chartData: [] };
  }
}

export default async function AdminDashboard() {
  const { sold, revenue, pending, checkedIn, chartData } = await getStats();

  const cards = [
    { icon: Ticket, label: "Tickets Sold", value: sold, sub: "Approved orders" },
    { icon: DollarSign, label: "Total Revenue", value: `ZMW ${revenue.toLocaleString()}`, sub: "From approved tickets" },
    { icon: Clock, label: "Pending Payments", value: pending, sub: "Awaiting verification" },
    { icon: UserCheck, label: "Checked In Today", value: checkedIn, sub: "Scanned today" },
  ];

  return (
    <div className="space-y-8">
      <h1 className="font-display text-3xl" style={{ color: "#F5F0E8" }}>DASHBOARD</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map(({ icon: Icon, label, value, sub }) => (
          <div key={label} className="card-dark p-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-body uppercase tracking-widest" style={{ color: "#9A8F78" }}>{label}</span>
              <Icon size={16} style={{ color: "#C9A84C" }} />
            </div>
            <div className="font-display text-3xl mb-1" style={{ color: "#F5F0E8" }}>{value}</div>
            <div className="text-xs font-body" style={{ color: "#9A8F78" }}>{sub}</div>
          </div>
        ))}
      </div>

      <DashboardCharts chartData={chartData} />
    </div>
  );
}
