"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { buildTicketWhatsAppLink } from "@/lib/whatsapp";
import { formatTicketNumber } from "@/lib/generate-ticket-number";
import { generateQRCodeDataURL } from "@/lib/generate-qr";
import { generateTicketPDF } from "@/lib/generate-pdf";
import { Eye, CheckCircle, XCircle, Loader2, ExternalLink, Download, MessageCircle } from "lucide-react";

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
  transaction_id: string | null;
  payment_proof_url: string | null;
  rejection_reason: string | null;
}

const STATUS_COLORS: Record<string, { color: string; bg: string }> = {
  pending:    { color: "#F59E0B", bg: "rgba(245,158,11,0.1)" },
  approved:   { color: "#22C55E", bg: "rgba(34,197,94,0.1)" },
  rejected:   { color: "#EF4444", bg: "rgba(239,68,68,0.1)" },
  checked_in: { color: "#3B82F6", bg: "rgba(59,130,246,0.1)" },
};

export default function OrdersTable({ initialOrders }: { initialOrders: Order[] }) {
  const [orders, setOrders] = useState(initialOrders);
  const [viewOrder, setViewOrder] = useState<Order | null>(null);
  const [rejectOrder, setRejectOrder] = useState<Order | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [loading, setLoading] = useState<string | null>(null);
  const [generatedTickets, setGeneratedTickets] = useState<{ ticketNumber: string; qrUrl: string; waLink: string }[]>([]);
  const [filter, setFilter] = useState("all");

  const filtered = filter === "all" ? orders : orders.filter((o) => o.status === filter);

  async function approve(order: Order) {
    setLoading(order.id);
    try {
      const supabase = createClient();
      const tickets: { ticketNumber: string; qrUrl: string; waLink: string }[] = [];

      for (let i = 0; i < order.quantity; i++) {
        // Get sequence number
        const { data: seqData } = await supabase.rpc("nextval", { seq_name: "ticket_sequence" }).single();
        const seq = (seqData as number) ?? Date.now();
        const ticketNumber = formatTicketNumber(seq);

        // Generate QR
        const qrDataURL = await generateQRCodeDataURL(ticketNumber);
        const qrBlob = await fetch(qrDataURL).then((r) => r.blob());
        const qrPath = `${order.id}/${ticketNumber}.png`;
        await supabase.storage.from("tickets").upload(qrPath, qrBlob, { contentType: "image/png" });
        const { data: qrUrlData } = supabase.storage.from("tickets").getPublicUrl(qrPath);

        // Insert ticket
        await supabase.from("tickets").insert({
          ticket_number: ticketNumber,
          qr_code_url: qrUrlData.publicUrl,
          order_id: order.id,
          attendee_name: order.full_name,
          ticket_type: order.ticket_type,
        });

        tickets.push({
          ticketNumber,
          qrUrl: qrDataURL,
          waLink: buildTicketWhatsAppLink(order.phone, order.full_name, ticketNumber, order.ticket_type),
        });
      }

      await supabase
        .from("ticket_orders")
        .update({ status: "approved", approved_at: new Date().toISOString() })
        .eq("id", order.id);

      setOrders((prev) => prev.map((o) => o.id === order.id ? { ...o, status: "approved" } : o));
      setViewOrder(null);
      setGeneratedTickets(tickets);
    } catch (e) {
      alert("Approval failed: " + (e instanceof Error ? e.message : String(e)));
    }
    setLoading(null);
  }

  async function reject(order: Order) {
    if (!rejectReason.trim()) return;
    setLoading(order.id);
    const supabase = createClient();
    await supabase
      .from("ticket_orders")
      .update({ status: "rejected", rejection_reason: rejectReason })
      .eq("id", order.id);
    setOrders((prev) => prev.map((o) => o.id === order.id ? { ...o, status: "rejected", rejection_reason: rejectReason } : o));
    setRejectOrder(null);
    setRejectReason("");
    setLoading(null);
  }

  function downloadPDF(ticket: { ticketNumber: string; qrUrl: string }, order: Order) {
    const doc = generateTicketPDF({
      ticketNumber: ticket.ticketNumber,
      attendeeName: order.full_name,
      ticketType: order.ticket_type,
      qrCodeDataURL: ticket.qrUrl,
    });
    doc.save(`${ticket.ticketNumber}.pdf`);
  }

  return (
    <div>
      {/* Filter tabs */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {["all", "pending", "approved", "rejected", "checked_in"].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className="text-xs font-body uppercase tracking-widest px-4 py-2 rounded"
            style={{
              background: filter === s ? "rgba(201,168,76,0.15)" : "transparent",
              border: "1px solid",
              borderColor: filter === s ? "rgba(201,168,76,0.5)" : "rgba(201,168,76,0.15)",
              color: filter === s ? "#C9A84C" : "#9A8F78",
            }}
          >
            {s.replace("_", " ")}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto rounded-lg" style={{ border: "1px solid rgba(201,168,76,0.15)" }}>
        <table className="w-full text-sm font-body">
          <thead>
            <tr style={{ background: "#110E06", borderBottom: "1px solid rgba(201,168,76,0.15)" }}>
              {["Reference", "Name", "Phone", "Type", "Qty", "Amount", "Status", "Date", "Actions"].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-xs uppercase tracking-widest" style={{ color: "#9A8F78" }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={9} className="text-center py-10 text-sm" style={{ color: "#9A8F78" }}>
                  No orders found.
                </td>
              </tr>
            )}
            {filtered.map((order) => {
              const sc = STATUS_COLORS[order.status] ?? STATUS_COLORS.pending;
              return (
                <tr key={order.id} style={{ borderBottom: "1px solid rgba(201,168,76,0.08)" }}>
                  <td className="px-4 py-3 font-display text-sm" style={{ color: "#C9A84C" }}>{order.reference_number}</td>
                  <td className="px-4 py-3" style={{ color: "#F5F0E8" }}>{order.full_name}</td>
                  <td className="px-4 py-3" style={{ color: "#9A8F78" }}>{order.phone}</td>
                  <td className="px-4 py-3 uppercase text-xs" style={{ color: "#F5F0E8" }}>{order.ticket_type}</td>
                  <td className="px-4 py-3" style={{ color: "#F5F0E8" }}>{order.quantity}</td>
                  <td className="px-4 py-3" style={{ color: "#C9A84C" }}>ZMW {Number(order.amount).toFixed(2)}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 rounded text-xs uppercase tracking-widest" style={{ color: sc.color, background: sc.bg }}>
                      {order.status.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs" style={{ color: "#9A8F78" }}>
                    {new Date(order.created_at).toLocaleDateString("en-GB")}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => setViewOrder(order)} title="View" style={{ color: "#9A8F78" }}>
                        <Eye size={15} />
                      </button>
                      {order.status === "pending" && (
                        <>
                          <button
                            onClick={() => approve(order)}
                            title="Approve"
                            style={{ color: "#22C55E" }}
                            disabled={loading === order.id}
                          >
                            {loading === order.id ? <Loader2 size={15} className="animate-spin" /> : <CheckCircle size={15} />}
                          </button>
                          <button onClick={() => { setRejectOrder(order); setRejectReason(""); }} title="Reject" style={{ color: "#EF4444" }}>
                            <XCircle size={15} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* View Modal */}
      {viewOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.8)" }}>
          <div className="card-dark p-8 max-w-lg w-full space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start">
              <h2 className="font-display text-2xl" style={{ color: "#C9A84C" }}>{viewOrder.reference_number}</h2>
              <button onClick={() => setViewOrder(null)} style={{ color: "#9A8F78" }}>✕</button>
            </div>
            {[
              ["Name", viewOrder.full_name],
              ["Phone", viewOrder.phone],
              ["Type", viewOrder.ticket_type.toUpperCase()],
              ["Quantity", String(viewOrder.quantity)],
              ["Amount", `ZMW ${Number(viewOrder.amount).toFixed(2)}`],
              ["Transaction ID", viewOrder.transaction_id ?? "Not submitted"],
              ["Status", viewOrder.status],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between text-sm font-body">
                <span style={{ color: "#9A8F78" }}>{k}</span>
                <span style={{ color: "#F5F0E8" }}>{v}</span>
              </div>
            ))}
            {viewOrder.payment_proof_url && (
              <a href={viewOrder.payment_proof_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm" style={{ color: "#C9A84C" }}>
                <ExternalLink size={14} /> View Payment Screenshot
              </a>
            )}
            {viewOrder.status === "pending" && (
              <div className="flex gap-3 pt-2">
                <button
                  className="btn-gold flex-1 py-3"
                  onClick={() => approve(viewOrder)}
                  disabled={loading === viewOrder.id}
                >
                  {loading === viewOrder.id ? <Loader2 size={16} className="animate-spin mx-auto" /> : "Approve"}
                </button>
                <button
                  className="btn-outline flex-1 py-3"
                  onClick={() => { setRejectOrder(viewOrder); setViewOrder(null); }}
                >
                  Reject
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {rejectOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.8)" }}>
          <div className="card-dark p-8 max-w-md w-full space-y-4">
            <h2 className="font-display text-2xl" style={{ color: "#EF4444" }}>REJECT ORDER</h2>
            <p className="text-sm font-body" style={{ color: "#9A8F78" }}>
              Rejecting <strong style={{ color: "#F5F0E8" }}>{rejectOrder.reference_number}</strong>
            </p>
            <textarea
              className="input-dark"
              rows={3}
              placeholder="Reason for rejection..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
            />
            <div className="flex gap-3">
              <button className="btn-gold flex-1 py-3" onClick={() => reject(rejectOrder)} style={{ background: "#EF4444" }}>
                Confirm Reject
              </button>
              <button className="btn-outline flex-1 py-3" onClick={() => setRejectOrder(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Generated Tickets Modal */}
      {generatedTickets.length > 0 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.8)" }}>
          <div className="card-dark p-8 max-w-lg w-full space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start">
              <h2 className="font-display text-2xl" style={{ color: "#22C55E" }}>TICKETS GENERATED</h2>
              <button onClick={() => setGeneratedTickets([])} style={{ color: "#9A8F78" }}>✕</button>
            </div>
            {generatedTickets.map((t, i) => (
              <div key={t.ticketNumber} className="p-4 rounded-lg space-y-3" style={{ border: "1px solid rgba(201,168,76,0.15)", background: "#0D0A04" }}>
                <div className="font-display text-lg" style={{ color: "#C9A84C" }}>{t.ticketNumber}</div>
                <div className="flex gap-3">
                  <a href={t.waLink} target="_blank" rel="noopener noreferrer" className="btn-gold text-xs py-2 px-4 flex items-center gap-1.5">
                    <MessageCircle size={13} /> WhatsApp
                  </a>
                  <button
                    className="btn-outline text-xs py-2 px-4 flex items-center gap-1.5"
                    onClick={() => downloadPDF(t, orders.find((o) => o.status === "approved")!)}
                  >
                    <Download size={13} /> PDF
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
