"use client";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Nav from "@/components/nav";
import Footer from "@/components/footer";
import { createClient } from "@/lib/supabase/client";
import { generateReference } from "@/lib/generate-reference";
import { Loader2 } from "lucide-react";
import { Suspense } from "react";

const STANDARD_PRICE = Number(process.env.NEXT_PUBLIC_STANDARD_PRICE ?? 150);
const VIP_PRICE = Number(process.env.NEXT_PUBLIC_VIP_PRICE ?? 350);

function TicketForm() {
  const params = useSearchParams();
  const router = useRouter();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [ticketType, setTicketType] = useState<"standard" | "vip">(
    (params.get("type") as "standard" | "vip") ?? "standard"
  );
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const price = ticketType === "vip" ? VIP_PRICE : STANDARD_PRICE;
  const total = price * quantity;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    // Basic validation
    if (!name.trim()) return setError("Full name is required.");
    if (!phone.trim()) return setError("Phone number is required.");
    if (!/^(09|07)\d{8}$/.test(phone.replace(/\s/g, "")))
      return setError("Enter a valid Zambian phone number (e.g. 0971234567).");

    setLoading(true);
    try {
      const reference = generateReference();
      const supabase = createClient();
      const { error: dbError } = await supabase.from("ticket_orders").insert({
        reference_number: reference,
        full_name: name.trim(),
        phone: phone.trim(),
        email: email.trim() || null,
        ticket_type: ticketType,
        quantity,
        amount: total,
        status: "pending",
      });
      if (dbError) throw new Error(dbError.message);
      router.push(`/tickets/${reference}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-xs font-body uppercase tracking-widest mb-2" style={{ color: "#9A8F78" }}>
          Full Name *
        </label>
        <input
          className="input-dark"
          placeholder="e.g. Chanda Mwale"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div>
        <label className="block text-xs font-body uppercase tracking-widest mb-2" style={{ color: "#9A8F78" }}>
          Phone Number *
        </label>
        <input
          className="input-dark"
          placeholder="e.g. 0971234567"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          type="tel"
          required
        />
      </div>
      <div>
        <label className="block text-xs font-body uppercase tracking-widest mb-2" style={{ color: "#9A8F78" }}>
          Email (Optional)
        </label>
        <input
          className="input-dark"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
        />
      </div>
      <div>
        <label className="block text-xs font-body uppercase tracking-widest mb-2" style={{ color: "#9A8F78" }}>
          Ticket Type *
        </label>
        <select
          className="input-dark"
          value={ticketType}
          onChange={(e) => setTicketType(e.target.value as "standard" | "vip")}
        >
          <option value="standard">Standard — ZMW {STANDARD_PRICE}</option>
          <option value="vip">VIP — ZMW {VIP_PRICE}</option>
        </select>
      </div>
      <div>
        <label className="block text-xs font-body uppercase tracking-widest mb-2" style={{ color: "#9A8F78" }}>
          Quantity *
        </label>
        <select
          className="input-dark"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
        >
          {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
            <option key={n} value={n}>{n} ticket{n > 1 ? "s" : ""}</option>
          ))}
        </select>
      </div>

      {/* Total */}
      <div
        className="flex justify-between items-center p-4 rounded-lg"
        style={{ background: "rgba(201,168,76,0.07)", border: "1px solid rgba(201,168,76,0.2)" }}
      >
        <span className="font-body text-sm" style={{ color: "#9A8F78" }}>Total Amount</span>
        <span className="font-display text-2xl" style={{ color: "#C9A84C" }}>ZMW {total.toFixed(2)}</span>
      </div>

      {error && (
        <p className="text-sm font-body p-3 rounded" style={{ color: "#FF6B6B", background: "rgba(255,107,107,0.1)", border: "1px solid rgba(255,107,107,0.2)" }}>
          {error}
        </p>
      )}

      <button type="submit" className="btn-gold w-full text-base py-4" disabled={loading}>
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 size={18} className="animate-spin" /> Processing...
          </span>
        ) : (
          "Proceed to Payment →"
        )}
      </button>
    </form>
  );
}

export default function TicketsPage() {
  return (
    <>
      <Nav />
      <main className="pt-24 pb-20">
        <section
          className="py-16 px-4 text-center"
          style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(201,168,76,0.08) 0%, transparent 60%), #0A0804" }}
        >
          <span className="text-xs font-body tracking-[0.3em] uppercase" style={{ color: "#C9A84C" }}>
            Tickets
          </span>
          <h1 className="font-display text-5xl sm:text-7xl mt-3" style={{ color: "#F5F0E8" }}>
            GET TICKETS
          </h1>
          <p className="font-body text-sm mt-3" style={{ color: "#9A8F78" }}>
            MPHATSO Album Launch Concert · Saturday, 1 August 2026
          </p>
        </section>

        <div className="max-w-lg mx-auto px-4 mt-10">
          <div className="card-dark p-8">
            <h2 className="font-display text-2xl mb-6" style={{ color: "#F5F0E8" }}>YOUR DETAILS</h2>
            <Suspense fallback={<div className="text-center py-8" style={{ color: "#9A8F78" }}>Loading...</div>}>
              <TicketForm />
            </Suspense>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
