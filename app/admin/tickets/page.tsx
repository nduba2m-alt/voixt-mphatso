import { createServiceClient } from "@/lib/supabase/server";

export default async function AdminTicketsPage() {
  const supabase = await createServiceClient();
  const { data: tickets } = await supabase
    .from("tickets")
    .select("*, ticket_orders(reference_number, phone)")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl" style={{ color: "#F5F0E8" }}>TICKETS</h1>
      <div className="overflow-x-auto rounded-lg" style={{ border: "1px solid rgba(201,168,76,0.15)" }}>
        <table className="w-full text-sm font-body">
          <thead>
            <tr style={{ background: "#110E06", borderBottom: "1px solid rgba(201,168,76,0.15)" }}>
              {["Ticket #", "Attendee", "Type", "Checked In", "Check-in Time"].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-xs uppercase tracking-widest" style={{ color: "#9A8F78" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(tickets ?? []).length === 0 && (
              <tr><td colSpan={5} className="text-center py-10 text-sm" style={{ color: "#9A8F78" }}>No tickets generated yet.</td></tr>
            )}
            {(tickets ?? []).map((t) => (
              <tr key={t.id} style={{ borderBottom: "1px solid rgba(201,168,76,0.08)" }}>
                <td className="px-4 py-3 font-display text-sm" style={{ color: "#C9A84C" }}>{t.ticket_number}</td>
                <td className="px-4 py-3" style={{ color: "#F5F0E8" }}>{t.attendee_name}</td>
                <td className="px-4 py-3 uppercase text-xs" style={{ color: "#F5F0E8" }}>{t.ticket_type}</td>
                <td className="px-4 py-3">
                  <span className="px-2 py-1 rounded text-xs" style={{
                    color: t.checked_in ? "#22C55E" : "#9A8F78",
                    background: t.checked_in ? "rgba(34,197,94,0.1)" : "transparent",
                  }}>
                    {t.checked_in ? "Yes" : "No"}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs" style={{ color: "#9A8F78" }}>
                  {t.checked_in_at ? new Date(t.checked_in_at).toLocaleString() : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
