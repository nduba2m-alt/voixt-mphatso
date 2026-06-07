import Link from "next/link";
import Nav from "@/components/nav";
import Footer from "@/components/footer";
import Countdown from "@/components/countdown";
import { Calendar, MapPin, Music, CreditCard, CheckCircle, Upload, MessageCircle, Ticket } from "lucide-react";

const EVENT_DATE = process.env.NEXT_PUBLIC_EVENT_DATE ?? "2026-08-01T18:00:00+02:00";

export default function HomePage() {
  return (
    <>
      <Nav />
      <main>
        {/* Hero */}
        <section
          className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 pt-20"
          style={{
            background:
              "radial-gradient(ellipse at 50% 0%, rgba(201,168,76,0.12) 0%, transparent 70%), #0A0804",
          }}
        >
          <div className="animate-fade-up">
            <span
              className="inline-block text-xs font-body tracking-[0.3em] uppercase mb-6 px-4 py-1.5 rounded-full"
              style={{
                color: "#C9A84C",
                border: "1px solid rgba(201,168,76,0.3)",
                background: "rgba(201,168,76,0.06)",
              }}
            >
              VOIXT presents
            </span>
          </div>
          <h1
            className="font-display animate-fade-up delay-100"
            style={{
              fontSize: "clamp(5rem, 20vw, 14rem)",
              lineHeight: 0.9,
              letterSpacing: "0.04em",
              background: "linear-gradient(135deg, #8B6914 0%, #C9A84C 40%, #E8C97A 60%, #C9A84C 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            MPHATSO
          </h1>
          <p
            className="font-editorial text-xl sm:text-2xl mt-4 animate-fade-up delay-200"
            style={{ color: "#9A8F78", fontStyle: "italic" }}
          >
            Album Launch Concert · 1 August 2026
          </p>

          <div className="mt-10 animate-fade-up delay-300">
            <Countdown targetDate={EVENT_DATE} />
          </div>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 animate-fade-up delay-400">
            <Link href="/tickets" className="btn-gold text-base px-10 py-4">
              Get Tickets
            </Link>
            <Link href="/about/mphatso" className="btn-outline text-base px-10 py-4">
              About MPHATSO
            </Link>
          </div>

          <div
            className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
            style={{ background: "linear-gradient(to bottom, transparent, #0A0804)" }}
          />
        </section>

        {/* Event Info Bar */}
        <section style={{ background: "#110E06", borderTop: "1px solid rgba(201,168,76,0.15)", borderBottom: "1px solid rgba(201,168,76,0.15)" }}>
          <div className="max-w-5xl mx-auto px-4 py-6 grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Calendar, label: "Date", value: "Saturday, 1 August 2026" },
              { icon: MapPin, label: "Venue", value: "Lusaka, Zambia (TBA)" },
              { icon: Music, label: "Group", value: "VOIXT" },
              { icon: CreditCard, label: "Payment", value: "MTN & Airtel Money" },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-start gap-3">
                <Icon size={18} style={{ color: "#C9A84C", marginTop: 2, flexShrink: 0 }} />
                <div>
                  <div className="text-xs font-body uppercase tracking-widest" style={{ color: "#9A8F78" }}>
                    {label}
                  </div>
                  <div className="text-sm font-body mt-0.5" style={{ color: "#F5F0E8" }}>
                    {value}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* About MPHATSO Teaser */}
        <section className="py-20 px-4 max-w-3xl mx-auto text-center">
          <span className="text-xs font-body tracking-[0.3em] uppercase" style={{ color: "#C9A84C" }}>
            The Album
          </span>
          <h2
            className="font-editorial mt-3 mb-6"
            style={{ fontSize: "clamp(2rem, 6vw, 3.5rem)", color: "#F5F0E8", fontWeight: 300 }}
          >
            A Story of{" "}
            <em style={{ color: "#C9A84C" }}>Identity, Faith &amp; Belonging</em>
          </h2>
          <p className="font-body text-base leading-relaxed" style={{ color: "#9A8F78" }}>
            MPHATSO is VOIXT&apos;s debut album — a deeply personal and spiritually rich collection of music
            that speaks to the soul of every Zambian. Each song is a chapter, each melody a prayer.
            Come experience the full story on 1 August 2026.
          </p>
          <Link href="/about/mphatso" className="btn-outline mt-8 inline-block">
            Discover More
          </Link>
        </section>

        {/* Ticket Types */}
        <section style={{ background: "#110E06", borderTop: "1px solid rgba(201,168,76,0.1)" }} className="py-20 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <span className="text-xs font-body tracking-[0.3em] uppercase" style={{ color: "#C9A84C" }}>
                Tickets
              </span>
              <h2 className="font-display text-4xl sm:text-5xl mt-2" style={{ color: "#F5F0E8" }}>
                CHOOSE YOUR EXPERIENCE
              </h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  type: "Standard",
                  price: "ZMW 150",
                  desc: "General Admission — Full concert access",
                  features: ["Full concert access", "Standing area", "MPHATSO experience"],
                  featured: false,
                },
                {
                  type: "VIP",
                  price: "ZMW 350",
                  desc: "Priority seating + exclusive experience",
                  features: ["Priority seating", "Exclusive VIP area", "Premium experience", "Early entry"],
                  featured: true,
                },
              ].map((t) => (
                <div
                  key={t.type}
                  className="card-dark p-8 relative overflow-hidden"
                  style={t.featured ? { border: "1px solid rgba(201,168,76,0.5)", background: "#130F05" } : undefined}
                >
                  {t.featured && (
                    <div
                      className="absolute top-4 right-4 text-xs font-body font-semibold px-3 py-1 rounded-full"
                      style={{ background: "rgba(201,168,76,0.15)", color: "#C9A84C", border: "1px solid rgba(201,168,76,0.3)" }}
                    >
                      Most Popular
                    </div>
                  )}
                  <div className="font-display text-2xl mb-1" style={{ color: "#C9A84C" }}>
                    {t.type}
                  </div>
                  <div className="font-display text-5xl my-4" style={{ color: "#F5F0E8" }}>
                    {t.price}
                  </div>
                  <p className="text-sm font-body mb-6" style={{ color: "#9A8F78" }}>
                    {t.desc}
                  </p>
                  <ul className="space-y-2 mb-8">
                    {t.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm font-body" style={{ color: "#F5F0E8" }}>
                        <CheckCircle size={14} style={{ color: "#C9A84C" }} />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={`/tickets?type=${t.type.toLowerCase()}`}
                    className={t.featured ? "btn-gold w-full text-center block" : "btn-outline w-full text-center block"}
                  >
                    Get {t.type} Ticket
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Payment Flow Steps */}
        <section className="py-20 px-4 max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-body tracking-[0.3em] uppercase" style={{ color: "#C9A84C" }}>
              How It Works
            </span>
            <h2 className="font-display text-4xl sm:text-5xl mt-2" style={{ color: "#F5F0E8" }}>
              GET YOUR TICKET IN 5 STEPS
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-6">
            {[
              { icon: Ticket, step: "01", label: "Choose Ticket", desc: "Select ticket type and quantity" },
              { icon: CreditCard, step: "02", label: "Get Reference", desc: "Receive your unique payment reference" },
              { icon: Upload, step: "03", label: "Pay via Mobile Money", desc: "Send payment via MTN or Airtel" },
              { icon: CheckCircle, step: "04", label: "Upload Proof", desc: "Submit screenshot & transaction ID" },
              { icon: MessageCircle, step: "05", label: "Receive on WhatsApp", desc: "Get your QR ticket on WhatsApp" },
            ].map(({ icon: Icon, step, label, desc }) => (
              <div key={step} className="text-center">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3"
                  style={{ background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.25)" }}
                >
                  <Icon size={20} style={{ color: "#C9A84C" }} />
                </div>
                <div className="font-display text-xs tracking-widest mb-1" style={{ color: "#C9A84C" }}>
                  {step}
                </div>
                <div className="text-sm font-body font-semibold mb-1" style={{ color: "#F5F0E8" }}>
                  {label}
                </div>
                <div className="text-xs font-body" style={{ color: "#9A8F78" }}>
                  {desc}
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/tickets" className="btn-gold text-base px-12 py-4">
              Buy Tickets Now
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
