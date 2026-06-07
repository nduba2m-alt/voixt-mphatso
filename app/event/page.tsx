import Nav from "@/components/nav";
import Footer from "@/components/footer";
import Link from "next/link";
import { Calendar, MapPin, Clock, Phone, Mail } from "lucide-react";

const FAQ = [
  { q: "Where is the venue?", a: "The venue will be announced soon. Stay tuned on our social media channels for the full address." },
  { q: "What time does the concert start?", a: "Doors open at 5:00 PM and the concert begins at 5:30 PM. The programme runs until 7:00 PM." },
  { q: "How do I get my ticket after paying?", a: "After you submit your payment proof, our team will verify and send your QR ticket via WhatsApp within 24 hours." },
  { q: "Can I buy tickets at the door?", a: "We strongly recommend buying in advance. Limited tickets may be available at the door." },
  { q: "What do I need to bring on the day?", a: "Bring your QR ticket (screenshot or printout) and a valid ID. VIP ticket holders should arrive 30 minutes early." },
  { q: "Are children allowed?", a: "Yes! The event is family-friendly. Children under 5 are free with a paying adult." },
];

const SCHEDULE = [
  { time: "5:00 PM", event: "Doors Open" },
  { time: "5:30 PM", event: "Opening Act" },
  { time: "6:00 PM", event: "VOIXT Takes the Stage" },
  { time: "6:30 PM", event: "MPHATSO Album Showcase" },
  { time: "7:00 PM", event: "Finale & Close" },
];

export default function EventPage() {
  return (
    <>
      <Nav />
      <main className="pt-24 pb-20">
        <section
          className="py-16 px-4 text-center"
          style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(201,168,76,0.08) 0%, transparent 60%), #0A0804" }}
        >
          <span className="text-xs font-body tracking-[0.3em] uppercase" style={{ color: "#C9A84C" }}>
            Event Information
          </span>
          <h1 className="font-display text-5xl sm:text-7xl mt-3" style={{ color: "#F5F0E8" }}>
            THE EVENT
          </h1>
        </section>

        <div className="max-w-4xl mx-auto px-4 space-y-16 mt-12">
          {/* Event Details */}
          <section className="grid sm:grid-cols-3 gap-6">
            {[
              { icon: Calendar, label: "Date", value: "Saturday, 1 August 2026" },
              { icon: Clock, label: "Time", value: "5:00 PM – 7:00 PM" },
              { icon: MapPin, label: "Venue", value: "Lusaka, Zambia (TBA)" },
            ].map(({ icon: Icon, label, value }) => (
              <div
                key={label}
                className="p-6 rounded-lg text-center"
                style={{ background: "#110E06", border: "1px solid rgba(201,168,76,0.15)" }}
              >
                <Icon size={28} style={{ color: "#C9A84C", margin: "0 auto 12px" }} />
                <div className="text-xs font-body uppercase tracking-widest mb-2" style={{ color: "#9A8F78" }}>
                  {label}
                </div>
                <div className="font-body font-semibold" style={{ color: "#F5F0E8" }}>
                  {value}
                </div>
              </div>
            ))}
          </section>

          {/* Map Placeholder */}
          <section>
            <h2 className="font-display text-3xl mb-4" style={{ color: "#C9A84C" }}>VENUE & DIRECTIONS</h2>
            <div
              className="rounded-lg flex items-center justify-center"
              style={{ height: 240, background: "#110E06", border: "1px solid rgba(201,168,76,0.15)" }}
            >
              <div className="text-center">
                <MapPin size={32} style={{ color: "#C9A84C", margin: "0 auto 8px" }} />
                <p className="text-sm font-body" style={{ color: "#9A8F78" }}>
                  Venue map will be displayed here once confirmed
                </p>
              </div>
            </div>
          </section>

          {/* Programme */}
          <section>
            <h2 className="font-display text-3xl mb-6" style={{ color: "#C9A84C" }}>PROGRAMME</h2>
            <div className="space-y-3">
              {SCHEDULE.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 p-4 rounded-lg"
                  style={{ background: "#110E06", border: "1px solid rgba(201,168,76,0.1)" }}
                >
                  <div className="font-display text-base w-20 shrink-0" style={{ color: "#C9A84C" }}>
                    {item.time}
                  </div>
                  <div className="text-sm font-body" style={{ color: "#F5F0E8" }}>{item.event}</div>
                </div>
              ))}
            </div>
          </section>

          {/* FAQ */}
          <section>
            <h2 className="font-display text-3xl mb-6" style={{ color: "#C9A84C" }}>FAQ</h2>
            <div className="space-y-4">
              {FAQ.map((item) => (
                <details
                  key={item.q}
                  className="rounded-lg overflow-hidden"
                  style={{ border: "1px solid rgba(201,168,76,0.15)" }}
                >
                  <summary
                    className="p-5 font-body font-semibold cursor-pointer select-none"
                    style={{ background: "#110E06", color: "#F5F0E8", listStyle: "none" }}
                  >
                    {item.q}
                  </summary>
                  <div className="p-5 text-sm font-body leading-relaxed" style={{ background: "#0D0A04", color: "#9A8F78" }}>
                    {item.a}
                  </div>
                </details>
              ))}
            </div>
          </section>

          {/* Contact */}
          <section>
            <h2 className="font-display text-3xl mb-6" style={{ color: "#C9A84C" }}>CONTACT</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-4 rounded-lg" style={{ background: "#110E06", border: "1px solid rgba(201,168,76,0.1)" }}>
                <Phone size={18} style={{ color: "#C9A84C" }} />
                <div>
                  <div className="text-xs font-body uppercase tracking-widest" style={{ color: "#9A8F78" }}>WhatsApp</div>
                  <div className="text-sm font-body mt-0.5" style={{ color: "#F5F0E8" }}>
                    +260 {process.env.NEXT_PUBLIC_ADMIN_WHATSAPP ?? "XXXXXXXXX"}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-lg" style={{ background: "#110E06", border: "1px solid rgba(201,168,76,0.1)" }}>
                <Mail size={18} style={{ color: "#C9A84C" }} />
                <div>
                  <div className="text-xs font-body uppercase tracking-widest" style={{ color: "#9A8F78" }}>Email</div>
                  <div className="text-sm font-body mt-0.5" style={{ color: "#F5F0E8" }}>info@voixt.com</div>
                </div>
              </div>
            </div>
          </section>

          <div className="text-center">
            <Link href="/tickets" className="btn-gold text-base px-12 py-4">Get Your Tickets</Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
