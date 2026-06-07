"use client";
import { Download } from "lucide-react";

interface Order {
  id: string;
  reference_number: string;
  full_name: string;
  phone: string;
  ticket_type: string;
  quantity: number;
  amount: number;
  status: string;
  created_at: string;
}

export default function ReportsClient({ orders }: { orders: Order[] }) {
  const approved = orders.filter((o) => o.status === "approved" || o.status === "checked_in");
  const pending = orders.filter((o) => o.status === "pending");
  const totalRevenue = approved.reduce((s, o) => s + Number(o.amount), 0);
  const standardCount = approved.filter((o) => o.ticket_type === "standard").reduce((s, o) => s + o.quantity, 0);
  const vipCount = approved.filter((o) => o.ticket_type === "vip").reduce((s, o) => s + o.quantity, 0);

  function downloadCSV() {
    const headers = ["Reference", "Name", "Phone", "Type", "Qty", "Amount", "Status", "Date"];
    const rows = orders.map((o) => [
      o.reference_number, o.full_name, o.phone, o.ticket_type, o.quantity, o.amount, o.status,
      new Date(o.created_at).toLocaleDateString("en-GB"),
    ]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `mphatso-orders-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Standard Sold", value: standardCount },
          { label: "VIP Sold", value: vipCount },
          { label: "Total Revenue", value: `ZMW ${totalRevenue.toLocaleString()}` },
          { label: "Pending", value: pending.length },
        ].map(({ label, value }) => (
          <div key={label} className="card-dark p-6">
            <div className="text-xs font-body uppercase tracking-widest mb-2" style={{ color: "#9A8F78" }}>{label}</div>
            <div className="font-display text-3xl" style={{ color: "#C9A84C" }}>{value}</div>
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        <button onClick={downloadCSV} className="btn-outline flex items-center gap-2 py-2 px-5">
          <Download size={15} /> Export CSV
        </button>
      </div>

      {/* Pending approvals */}
      {pending.length > 0 && (
        <div>
          <h2 className="font-display text-xl mb-4" style={{ color: "#F59E0B" }}>PENDING APPROVALS ({pending.length})</h2>
          <div className="overflow-x-auto rounded-lg" style={{ border: "1px solid rgba(245,158,11,0.2)" }}>
            <table className="w-full text-sm font-body">
              <thead>
                <tr style={{ background: "#110E06", borderBottom: "1px solid rgba(201,168,76,0.15)" }}>
                  {["Reference", "Name", "Phone", "Type", "Amount", "Date"].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs uppercase tracking-widest" style={{ color: "#9A8F78" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pending.map((o) => (
                  <tr key={o.id} style={{ borderBottom: "1px solid rgba(201,168,76,0.08)" }}>
                    <td className="px-4 py-3 font-display text-sm" style={{ color: "#C9A84C" }}>{o.reference_number}</td>
                    <td className="px-4 py-3" style={{ color: "#F5F0E8" }}>{o.full_name}</td>
                    <td className="px-4 py-3" style={{ color: "#9A8F78" }}>{o.phone}</td>
                    <td className="px-4 py-3 uppercase text-xs" style={{ color: "#F5F0E8" }}>{o.ticket_type}</td>
                    <td className="px-4 py-3" style={{ color: "#C9A84C" }}>ZMW {Number(o.amount).toFixed(2)}</td>
                    <td className="px-4 py-3 text-xs" style={{ color: "#9A8F78" }}>{new Date(o.created_at).toLocaleDateString("en-GB")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
