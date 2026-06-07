"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Search, CheckCircle, XCircle, Loader2, AlertTriangle, Camera, Keyboard } from "lucide-react";
import dynamic from "next/dynamic";

// Dynamically import QR scanner to avoid SSR issues
const Scanner = dynamic(
  () => import("@yudiel/react-qr-scanner").then((m) => m.Scanner),
  { ssr: false, loading: () => (
    <div className="flex items-center justify-center h-64" style={{ background: "#110E06", borderRadius: 8 }}>
      <Loader2 size={28} className="animate-spin" style={{ color: "#C9A84C" }} />
    </div>
  )}
);

interface TicketResult {
  id: string;
  ticket_number: string;
  attendee_name: string;
  ticket_type: string;
  checked_in: boolean;
  checked_in_at: string | null;
  ticket_orders: { status: string };
}

type ResultState =
  | { kind: "found"; ticket: TicketResult }
  | { kind: "already_checked_in"; ticket: TicketResult }
  | { kind: "not_found"; query: string }
  | { kind: "not_approved" }
  | { kind: "checked_in_now"; ticket: TicketResult };

export default function AdminCheckinPage() {
  const [mode, setMode] = useState<"manual" | "scanner">("manual");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ResultState | null>(null);
  const [checkingIn, setCheckingIn] = useState(false);
  const [scannerActive, setScannerActive] = useState(false);

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
      .maybeSingle();

    setLoading(false);
    if (!data) { setResult({ kind: "not_found", query: q.trim() }); return; }

    const ticket = data as TicketResult;
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
    await supabase
      .from("tickets")
      .update({ checked_in: true, checked_in_at: new Date().toISOString() })
      .eq("id", ticket.id);
    setResult({ kind: "checked_in_now", ticket: { ...ticket, checked_in: true, checked_in_at: new Date().toISOString() } });
    setCheckingIn(false);
    setScannerActive(false);
  }

  function reset() {
    setResult(null);
    setQuery("");
    setScannerActive(mode === "scanner");
  }

  function handleScan(results: { rawValue: string }[]) {
    if (results?.[0]?.rawValue && !loading && !result) {
      setScannerActive(false);
      lookup(results[0].rawValue);
    }
  }

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl" style={{ color: "#F5F0E8" }}>CHECK-IN</h1>
        <div className="text-xs font-body" style={{ color: "#9A8F78" }}>
          MPHATSO · 1 August 2026
        </div>
      </div>

      {/* Mode Toggle */}
      <div className="flex gap-2">
        <button
          onClick={() => { setMode("manual"); setScannerActive(false); setResult(null); }}
          className="flex items-center gap-2 px-4 py-2 rounded text-sm font-body"
          style={{
            background: mode === "manual" ? "rgba(201,168,76,0.15)" : "transparent",
            border: "1px solid",
            borderColor: mode === "manual" ? "rgba(201,168,76,0.5)" : "rgba(201,168,76,0.15)",
            color: mode === "manual" ? "#C9A84C" : "#9A8F78",
          }}
        >
          <Keyboard size={15} /> Manual Lookup
        </button>
        <button
          onClick={() => { setMode("scanner"); setScannerActive(true); setResult(null); setQuery(""); }}
          className="flex items-center gap-2 px-4 py-2 rounded text-sm font-body"
          style={{
            background: mode === "scanner" ? "rgba(201,168,76,0.15)" : "transparent",
            border: "1px solid",
            borderColor: mode === "scanner" ? "rgba(201,168,76,0.5)" : "rgba(201,168,76,0.15)",
            color: mode === "scanner" ? "#C9A84C" : "#9A8F78",
          }}
        >
          <Camera size={15} /> Scan QR Code
        </button>
      </div>

      {/* Manual Search */}
      {mode === "manual" && (
        <div className="card-dark p-6 space-y-4">
          <div className="flex gap-3">
            <input
              className="input-dark"
              placeholder="Ticket number or attendee name..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && lookup(query)}
              autoFocus
            />
            <button
              onClick={() => lookup(query)}
              className="btn-gold px-5 flex items-center justify-center shrink-0"
              disabled={loading}
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : <Search size={18} />}
            </button>
          </div>
          <p className="text-xs font-body" style={{ color: "#9A8F78" }}>
            Enter ticket number (e.g. IMP-2026-00001) or full name
          </p>
        </div>
      )}

      {/* QR Scanner */}
      {mode === "scanner" && (
        <div className="card-dark p-4 space-y-3">
          {scannerActive ? (
            <>
              <p className="text-xs font-body text-center" style={{ color: "#C9A84C" }}>
                Point camera at the QR code on the ticket
              </p>
              <div className="rounded-lg overflow-hidden" style={{ border: "2px solid rgba(201,168,76,0.3)" }}>
                <Scanner
                  onScan={handleScan}
                  onError={(e) => console.error(e)}
                  constraints={{ facingMode: "environment" }}
                  styles={{ container: { borderRadius: 6 } }}
                />
              </div>
              <button
                onClick={() => setScannerActive(false)}
                className="btn-outline w-full text-sm py-2"
              >
                Stop Camera
              </button>
            </>
          ) : (
            <button
              onClick={() => { setScannerActive(true); setResult(null); }}
              className="btn-gold w-full py-4 flex items-center justify-center gap-2"
            >
              <Camera size={20} /> Start QR Scanner
            </button>
          )}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="card-dark p-8 text-center">
          <Loader2 size={32} className="animate-spin mx-auto" style={{ color: "#C9A84C" }} />
          <p className="text-sm font-body mt-3" style={{ color: "#9A8F78" }}>Looking up ticket...</p>
        </div>
      )}

      {/* Results */}
      {!loading && result && (
        <div className="space-y-3">
          {result.kind === "not_found" && (
            <div className="card-dark p-6 text-center space-y-3" style={{ border: "1px solid rgba(239,68,68,0.3)" }}>
              <XCircle size={40} style={{ color: "#EF4444", margin: "0 auto" }} />
              <div className="font-display text-xl" style={{ color: "#EF4444" }}>TICKET NOT FOUND</div>
              <p className="text-sm font-body" style={{ color: "#9A8F78" }}>No ticket found for "{result.query}"</p>
              <button onClick={reset} className="btn-outline text-sm py-2 px-6">Try Again</button>
            </div>
          )}

          {result.kind === "not_approved" && (
            <div className="card-dark p-6 text-center space-y-3" style={{ border: "1px solid rgba(245,158,11,0.3)" }}>
              <AlertTriangle size={40} style={{ color: "#F59E0B", margin: "0 auto" }} />
              <div className="font-display text-xl" style={{ color: "#F59E0B" }}>NOT APPROVED</div>
              <p className="text-sm font-body" style={{ color: "#9A8F78" }}>Payment not yet verified. Do not admit.</p>
              <button onClick={reset} className="btn-outline text-sm py-2 px-6">Try Again</button>
            </div>
          )}

          {result.kind === "already_checked_in" && (
            <div className="card-dark p-6 text-center space-y-3" style={{ border: "1px solid rgba(239,68,68,0.5)" }}>
              <AlertTriangle size={48} style={{ color: "#EF4444", margin: "0 auto" }} />
              <div className="font-display text-2xl" style={{ color: "#EF4444" }}>⚠️ ALREADY CHECKED IN</div>
              <div className="font-body text-lg font-semibold" style={{ color: "#F5F0E8" }}>{result.ticket.attendee_name}</div>
              <div className="font-display text-base" style={{ color: "#C9A84C" }}>{result.ticket.ticket_number}</div>
              <p className="text-xs font-body" style={{ color: "#9A8F78" }}>
                Checked in at: {result.ticket.checked_in_at
                  ? new Date(result.ticket.checked_in_at).toLocaleString("en-GB")
                  : "—"}
              </p>
              <p className="text-xs font-body font-semibold" style={{ color: "#EF4444" }}>
                DO NOT ADMIT — This ticket has already been used
              </p>
              <button onClick={reset} className="btn-outline text-sm py-2 px-6">Next Guest</button>
            </div>
          )}

          {result.kind === "found" && (
            <div className="card-dark p-6 space-y-4" style={{ border: "1px solid rgba(34,197,94,0.4)" }}>
              <div className="flex items-center justify-between">
                <div className="text-xs font-body uppercase tracking-widest" style={{ color: "#9A8F78" }}>Valid Ticket</div>
                <div
                  className="px-3 py-1 rounded-full text-xs font-body uppercase tracking-widest"
                  style={{ background: "rgba(34,197,94,0.1)", color: "#22C55E", border: "1px solid rgba(34,197,94,0.3)" }}
                >
                  ✓ Approved
                </div>
              </div>
              <div className="font-display text-lg" style={{ color: "#C9A84C" }}>{result.ticket.ticket_number}</div>
              <div className="font-body text-2xl font-semibold" style={{ color: "#F5F0E8" }}>{result.ticket.attendee_name}</div>
              <div
                className="inline-block px-4 py-1.5 rounded text-sm font-body font-semibold uppercase tracking-widest"
                style={{
                  background: result.ticket.ticket_type === "vip" ? "rgba(201,168,76,0.15)" : "rgba(255,255,255,0.05)",
                  color: result.ticket.ticket_type === "vip" ? "#C9A84C" : "#F5F0E8",
                  border: `1px solid ${result.ticket.ticket_type === "vip" ? "rgba(201,168,76,0.4)" : "rgba(255,255,255,0.1)"}`,
                }}
              >
                {result.ticket.ticket_type} Ticket
              </div>
              <button
                className="btn-gold w-full py-5 text-xl flex items-center justify-center gap-3"
                onClick={() => checkIn(result.ticket)}
                disabled={checkingIn}
              >
                {checkingIn
                  ? <><Loader2 size={22} className="animate-spin" /> Processing...</>
                  : <><CheckCircle size={22} /> ADMIT GUEST</>}
              </button>
              <button onClick={reset} className="btn-outline w-full text-sm py-2">Cancel</button>
            </div>
          )}

          {result.kind === "checked_in_now" && (
            <div className="card-dark p-8 text-center space-y-4" style={{ border: "2px solid rgba(34,197,94,0.6)" }}>
              <CheckCircle size={64} style={{ color: "#22C55E", margin: "0 auto" }} />
              <div className="font-display text-4xl" style={{ color: "#22C55E" }}>ADMITTED!</div>
              <div className="font-body text-xl font-semibold" style={{ color: "#F5F0E8" }}>{result.ticket.attendee_name}</div>
              <div className="font-display text-base" style={{ color: "#C9A84C" }}>{result.ticket.ticket_number}</div>
              <div
                className="inline-block px-4 py-1.5 rounded text-sm font-body uppercase tracking-widest"
                style={{ background: "rgba(201,168,76,0.1)", color: "#C9A84C" }}
              >
                {result.ticket.ticket_type}
              </div>
              <p className="text-sm font-body" style={{ color: "#9A8F78" }}>Enjoy the MPHATSO concert! 🎶</p>
              <button onClick={reset} className="btn-gold w-full py-3 text-base">Next Guest →</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
