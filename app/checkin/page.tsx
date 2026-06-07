"use client";
import { useState } from "react";
import Nav from "@/components/nav";
import { createClient } from "@/lib/supabase/client";
import { Search, CheckCircle, XCircle, Loader2, AlertTriangle } from "lucide-react";

interface TicketResult {
  id: string;
  ticket_number: string;
  attendee_name: string;
  ticket_type: string;
  checked_in: boolean;
  checked_in_at: string | null;
  order?: { status: string };
}

type ResultState =
  | { kind: "found"; ticket: TicketResult }
  | { kind: "already_checked_in"; ticket: TicketResult }
  | { kind: "not_found" }
  | { kind: "not_approved" }
  | { kind: "checked_in_now"; ticket: TicketResult };

export default function CheckinPage() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ResultState | null>(null);
  const [checkingIn, setCheckingIn] = useState(false);

  async function lookup(q: string) {
    if (!q.trim()) return;
    setLoading(true);
    setResult(null);
    const supabase = createClient();
    const { data } = await supabase
      .from("tickets")
      .select("*, ticket_orders!inner(status)")
      .or(`ticket_number.eq.${q.trim()},attendee_name.ilike.%${q.trim()}%`)
      .limit(1)
      .single();

    setLoading(false);
    if (!data) { setResult({ kind: "not_found" }); return; }

    const ticket = data as TicketResult & { ticket_orders: { status: string } };
    if (ticket.ticket_orders.status !== "approved" && ticket.ticket_orders.status !== "checked_in") {
      setResult({ kind: "not_approved" }); return;
    }
    if (ticket.checked_in) {
      setResult({ kind: "already_checked_in", ticket }); return;
    }
    setResult({ kind: "found", ticket });
  }

  async function checkIn(ticket: TicketResult) {
    setCheckingIn(true);
    const supabase = createClient();
    await supabase.from("tickets").update({ checked_in: true, checked_in_at: new Date().toISOString() }).eq("id", ticket.id);
    setResult({ kind: "checked_in_now", ticket: { ...ticket, checked_in: true, checked_in_at: new Date().toISOString() } });
    setCheckingIn(false);
  }

  return (
    <>
      <Nav />
      <div className="min-h-screen pt-20 px-4 pb-12" style={{ background: "#0A0804" }}>
        <div className="max-w-md mx-auto mt-8">
          <div className="text-center mb-8">
            <div className="font-display text-4xl gold-gradient mb-1">CHECK-IN</div>
            <div className="text-sm font-body" style={{ color: "#9A8F78" }}>MPHATSO Concert · 1 August 2026</div>
          </div>

          {/* Search */}
          <div className="card-dark p-6 space-y-4">
            <div className="flex gap-3">
              <input
                className="input-dark"
                placeholder="Ticket number or name..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && lookup(query)}
              />
              <button
                onClick={() => lookup(query)}
                className="btn-gold px-5 flex items-center justify-center"
                disabled={loading}
              >
                {loading ? <Loader2 size={18} className="animate-spin" /> : <Search size={18} />}
              </button>
            </div>
            <p className="text-xs font-body" style={{ color: "#9A8F78" }}>
              Enter a ticket number (IMP-2026-00001) or attendee name
            </p>
          </div>

          {/* Result */}
          {result && (
            <div className="mt-6">
              {result.kind === "not_found" && (
                <div className="card-dark p-6 text-center space-y-3">
                  <XCircle size={40} style={{ color: "#EF4444", margin: "0 auto" }} />
                  <div className="font-display text-xl" style={{ color: "#EF4444" }}>TICKET NOT FOUND</div>
                  <p className="text-sm font-body" style={{ color: "#9A8F78" }}>No ticket found for "{query}"</p>
                </div>
              )}
              {result.kind === "not_approved" && (
                <div className="card-dark p-6 text-center space-y-3">
                  <AlertTriangle size={40} style={{ color: "#F59E0B", margin: "0 auto" }} />
                  <div className="font-display text-xl" style={{ color: "#F59E0B" }}>NOT APPROVED</div>
                  <p className="text-sm font-body" style={{ color: "#9A8F78" }}>This ticket has not been approved yet.</p>
                </div>
              )}
              {result.kind === "already_checked_in" && (
                <div className="card-dark p-6 text-center space-y-3" style={{ border: "1px solid rgba(239,68,68,0.4)" }}>
                  <AlertTriangle size={40} style={{ color: "#EF4444", margin: "0 auto" }} />
                  <div className="font-display text-xl" style={{ color: "#EF4444" }}>⚠️ ALREADY CHECKED IN</div>
                  <div className="font-body text-base" style={{ color: "#F5F0E8" }}>{result.ticket.attendee_name}</div>
                  <div className="font-display text-lg" style={{ color: "#C9A84C" }}>{result.ticket.ticket_number}</div>
                  <p className="text-xs font-body" style={{ color: "#9A8F78" }}>
                    Checked in at: {result.ticket.checked_in_at ? new Date(result.ticket.checked_in_at).toLocaleString() : "—"}
                  </p>
                </div>
              )}
              {result.kind === "found" && (
                <div className="card-dark p-6 space-y-4" style={{ border: "1px solid rgba(34,197,94,0.3)" }}>
                  <div className="font-display text-lg" style={{ color: "#C9A84C" }}>{result.ticket.ticket_number}</div>
                  <div className="font-body text-xl font-semibold" style={{ color: "#F5F0E8" }}>{result.ticket.attendee_name}</div>
                  <div className="text-sm font-body uppercase tracking-widest" style={{ color: "#9A8F78" }}>
                    {result.ticket.ticket_type} Ticket
                  </div>
                  <button
                    className="btn-gold w-full py-4 text-lg"
                    onClick={() => checkIn(result.ticket)}
                    disabled={checkingIn}
                  >
                    {checkingIn ? <Loader2 size={20} className="animate-spin mx-auto" /> : "✓ CHECK IN"}
                  </button>
                </div>
              )}
              {result.kind === "checked_in_now" && (
                <div className="card-dark p-8 text-center space-y-3" style={{ border: "1px solid rgba(34,197,94,0.5)" }}>
                  <CheckCircle size={56} style={{ color: "#22C55E", margin: "0 auto" }} />
                  <div className="font-display text-3xl" style={{ color: "#22C55E" }}>WELCOME!</div>
                  <div className="font-body text-xl" style={{ color: "#F5F0E8" }}>{result.ticket.attendee_name}</div>
                  <div className="font-display text-lg" style={{ color: "#C9A84C" }}>{result.ticket.ticket_number}</div>
                  <p className="text-sm font-body" style={{ color: "#9A8F78" }}>Enjoy the MPHATSO concert! 🎶</p>
                  <button onClick={() => { setResult(null); setQuery(""); }} className="btn-outline text-sm py-2 px-6 mt-2">
                    Next Guest
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
