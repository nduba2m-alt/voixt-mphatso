"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Nav from "@/components/nav";
import Footer from "@/components/footer";
import { createClient } from "@/lib/supabase/client";
import { buildSupportWhatsAppLink } from "@/lib/whatsapp";
import { Upload, CheckCircle, Loader2, MessageCircle, Copy } from "lucide-react";

interface Order {
  id: string;
  reference_number: string;
  full_name: string;
  phone: string;
  ticket_type: string;
  quantity: number;
  amount: number;
  status: string;
  transaction_id: string | null;
  payment_proof_url: string | null;
}

export default function PaymentPage() {
  const { reference } = useParams<{ reference: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [transactionId, setTransactionId] = useState("");
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const mtnNumber = process.env.NEXT_PUBLIC_MTN_NUMBER ?? "09XXXXXXXX";
  const airtelNumber = process.env.NEXT_PUBLIC_AIRTEL_NUMBER ?? "09XXXXXXXX";

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("ticket_orders")
        .select("*")
        .eq("reference_number", reference)
        .single();
      if (error || !data) setError("Order not found.");
      else setOrder(data as Order);
      setLoading(false);
    }
    load();
  }, [reference]);

  async function handleSubmitProof(e: React.FormEvent) {
    e.preventDefault();
    if (!order) return;
    if (!transactionId.trim()) return setError("Please enter the transaction ID.");
    if (!proofFile) return setError("Please upload your payment screenshot.");

    setSubmitting(true);
    setError("");
    try {
      const supabase = createClient();

      // Upload proof
      const ext = proofFile.name.split(".").pop();
      const path = `${order.id}/${Date.now()}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from("payment-proofs")
        .upload(path, proofFile);
      if (uploadError) throw new Error(uploadError.message);

      const { data: urlData } = supabase.storage.from("payment-proofs").getPublicUrl(path);

      // Update order
      const { error: updateError } = await supabase
        .from("ticket_orders")
        .update({
          transaction_id: transactionId.trim(),
          payment_proof_url: urlData.publicUrl,
        })
        .eq("id", order.id);
      if (updateError) throw new Error(updateError.message);

      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed. Try again.");
    }
    setSubmitting(false);
  }

  function copyRef() {
    navigator.clipboard.writeText(reference);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (loading) {
    return (
      <>
        <Nav />
        <div className="min-h-screen flex items-center justify-center pt-20">
          <Loader2 size={32} className="animate-spin" style={{ color: "#C9A84C" }} />
        </div>
        <Footer />
      </>
    );
  }

  if (!order) {
    return (
      <>
        <Nav />
        <div className="min-h-screen flex items-center justify-center pt-20 px-4 text-center">
          <div>
            <h2 className="font-display text-3xl mb-3" style={{ color: "#C9A84C" }}>Order Not Found</h2>
            <p className="font-body" style={{ color: "#9A8F78" }}>
              We couldn&apos;t find an order with reference <strong>{reference}</strong>.
            </p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // Already approved
  if (order.status === "approved") {
    return (
      <>
        <Nav />
        <main className="pt-24 pb-20">
          <div className="max-w-lg mx-auto px-4 text-center">
            <CheckCircle size={56} style={{ color: "#22C55E", margin: "0 auto 16px" }} />
            <h1 className="font-display text-4xl mb-3" style={{ color: "#F5F0E8" }}>TICKET APPROVED</h1>
            <p className="font-body" style={{ color: "#9A8F78" }}>
              Your ticket for <strong style={{ color: "#C9A84C" }}>{order.full_name}</strong> has been approved. Check your WhatsApp for your QR ticket.
            </p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // Submitted proof — pending verification
  if (submitted || order.transaction_id) {
    const waLink = buildSupportWhatsAppLink(reference);
    return (
      <>
        <Nav />
        <main className="pt-24 pb-20">
          <div className="max-w-lg mx-auto px-4 text-center">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
              style={{ background: "rgba(201,168,76,0.12)", border: "2px solid rgba(201,168,76,0.4)" }}
            >
              <CheckCircle size={40} style={{ color: "#C9A84C" }} />
            </div>
            <h1 className="font-display text-4xl mb-3" style={{ color: "#F5F0E8" }}>PENDING VERIFICATION</h1>
            <p className="font-body mb-2" style={{ color: "#9A8F78" }}>
              Your payment proof has been received. Our team will verify within 24 hours and send your QR ticket on WhatsApp.
            </p>
            <div
              className="my-6 p-4 rounded-lg"
              style={{ background: "rgba(201,168,76,0.07)", border: "1px solid rgba(201,168,76,0.2)" }}
            >
              <div className="text-xs font-body uppercase tracking-widest mb-1" style={{ color: "#9A8F78" }}>Reference</div>
              <div className="font-display text-2xl" style={{ color: "#C9A84C" }}>{reference}</div>
            </div>
            <a href={waLink} target="_blank" rel="noopener noreferrer" className="btn-gold inline-flex items-center gap-2 px-8 py-3">
              <MessageCircle size={18} /> Message Us on WhatsApp
            </a>
            <p className="text-xs font-body mt-4" style={{ color: "#9A8F78" }}>
              Have questions? Tap above to send us a WhatsApp message with your reference number.
            </p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // Show payment instructions + proof upload
  return (
    <>
      <Nav />
      <main className="pt-24 pb-20">
        <div className="max-w-lg mx-auto px-4 space-y-6">
          {/* Reference banner */}
          <div
            className="p-6 rounded-lg text-center"
            style={{ background: "#110E06", border: "1px solid rgba(201,168,76,0.3)" }}
          >
            <div className="text-xs font-body uppercase tracking-widest mb-2" style={{ color: "#9A8F78" }}>
              Your Payment Reference
            </div>
            <div className="flex items-center justify-center gap-3">
              <span className="font-display text-3xl sm:text-4xl" style={{ color: "#C9A84C" }}>
                {reference}
              </span>
              <button onClick={copyRef} className="p-2 rounded" style={{ color: "#9A8F78" }} title="Copy reference">
                {copied ? <CheckCircle size={18} style={{ color: "#22C55E" }} /> : <Copy size={18} />}
              </button>
            </div>
            <div className="mt-3 text-sm font-body" style={{ color: "#F5F0E8" }}>
              {order.full_name} · {order.quantity} × {order.ticket_type.toUpperCase()} · <strong style={{ color: "#C9A84C" }}>ZMW {Number(order.amount).toFixed(2)}</strong>
            </div>
          </div>

          {/* Payment instructions */}
          <div className="card-dark p-6 space-y-4">
            <h2 className="font-display text-xl" style={{ color: "#F5F0E8" }}>STEP 1 — MAKE PAYMENT</h2>
            <p className="text-sm font-body" style={{ color: "#9A8F78" }}>
              Send the exact amount to one of the numbers below. Use your reference as the description.
            </p>
            {[
              { label: "MTN Money", number: mtnNumber, bg: "#FFCC00", textColor: "#000" },
              { label: "Airtel Money", number: airtelNumber, bg: "#FF0000", textColor: "#fff" },
            ].map((p) => (
              <div
                key={p.label}
                className="flex items-center justify-between p-4 rounded-lg"
                style={{ background: "rgba(201,168,76,0.06)", border: "1px solid rgba(201,168,76,0.15)" }}
              >
                <div>
                  <div className="text-xs font-body uppercase tracking-widest mb-0.5" style={{ color: "#9A8F78" }}>
                    {p.label}
                  </div>
                  <div className="font-display text-xl" style={{ color: "#F5F0E8" }}>{p.number}</div>
                </div>
                <button
                  onClick={() => navigator.clipboard.writeText(p.number)}
                  className="text-xs font-body px-3 py-1.5 rounded"
                  style={{ border: "1px solid rgba(201,168,76,0.3)", color: "#C9A84C" }}
                >
                  Copy
                </button>
              </div>
            ))}
            <div
              className="flex justify-between items-center p-3 rounded"
              style={{ background: "rgba(201,168,76,0.06)", border: "1px solid rgba(201,168,76,0.15)" }}
            >
              <span className="text-sm font-body" style={{ color: "#9A8F78" }}>Amount to pay:</span>
              <span className="font-display text-2xl" style={{ color: "#C9A84C" }}>ZMW {Number(order.amount).toFixed(2)}</span>
            </div>
          </div>

          {/* Proof upload form */}
          <form onSubmit={handleSubmitProof} className="card-dark p-6 space-y-5">
            <h2 className="font-display text-xl" style={{ color: "#F5F0E8" }}>STEP 2 — SUBMIT PROOF</h2>

            <div>
              <label className="block text-xs font-body uppercase tracking-widest mb-2" style={{ color: "#9A8F78" }}>
                Transaction ID *
              </label>
              <input
                className="input-dark"
                placeholder="e.g. MTNZ12345678"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-body uppercase tracking-widest mb-2" style={{ color: "#9A8F78" }}>
                Payment Screenshot *
              </label>
              <label
                className="flex flex-col items-center justify-center p-6 rounded-lg cursor-pointer transition-colors"
                style={{ border: "2px dashed rgba(201,168,76,0.3)", background: "rgba(201,168,76,0.03)" }}
              >
                <Upload size={28} style={{ color: "#C9A84C", marginBottom: 8 }} />
                <span className="text-sm font-body" style={{ color: "#9A8F78" }}>
                  {proofFile ? proofFile.name : "Tap to upload screenshot"}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => setProofFile(e.target.files?.[0] ?? null)}
                />
              </label>
            </div>

            {error && (
              <p className="text-sm font-body p-3 rounded" style={{ color: "#FF6B6B", background: "rgba(255,107,107,0.1)", border: "1px solid rgba(255,107,107,0.2)" }}>
                {error}
              </p>
            )}

            <button type="submit" className="btn-gold w-full text-base py-4" disabled={submitting}>
              {submitting ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 size={18} className="animate-spin" /> Submitting...
                </span>
              ) : (
                "Submit Payment Proof →"
              )}
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
}
