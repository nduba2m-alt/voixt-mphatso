import Nav from "@/components/nav";
import Footer from "@/components/footer";

export default function MediaPage() {
  return (
    <>
      <Nav />
      <main className="pt-24 pb-20">
        <section
          className="py-16 px-4 text-center"
          style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(201,168,76,0.08) 0%, transparent 60%), #0A0804" }}
        >
          <span className="text-xs font-body tracking-[0.3em] uppercase" style={{ color: "#C9A84C" }}>
            Media
          </span>
          <h1 className="font-display text-5xl sm:text-7xl mt-3" style={{ color: "#F5F0E8" }}>
            GALLERY
          </h1>
        </section>

        <div className="max-w-5xl mx-auto px-4 space-y-16 mt-12">
          {/* Videos */}
          <section>
            <h2 className="font-display text-3xl mb-6" style={{ color: "#C9A84C" }}>VIDEOS</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="rounded-lg flex items-center justify-center"
                  style={{ aspectRatio: "16/9", background: "#110E06", border: "1px solid rgba(201,168,76,0.15)" }}
                >
                  <div className="text-center">
                    <div className="text-3xl mb-2" style={{ color: "#C9A84C" }}>▶</div>
                    <p className="text-xs font-body" style={{ color: "#9A8F78" }}>Video {i} — coming soon</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Photos */}
          <section>
            <h2 className="font-display text-3xl mb-6" style={{ color: "#C9A84C" }}>PHOTOS</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {Array.from({ length: 9 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-lg"
                  style={{ aspectRatio: "1", background: "#110E06", border: "1px solid rgba(201,168,76,0.1)" }}
                />
              ))}
            </div>
            <p className="text-xs font-body mt-3 text-center" style={{ color: "#4A4535" }}>
              Photos from Supabase &apos;media&apos; bucket will appear here.
            </p>
          </section>

          {/* Social Links */}
          <section>
            <h2 className="font-display text-3xl mb-6" style={{ color: "#C9A84C" }}>FOLLOW VOIXT</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: "Facebook", href: "https://facebook.com", color: "#1877F2" },
                { label: "Instagram", href: "https://instagram.com", color: "#E1306C" },
                { label: "YouTube", href: "https://youtube.com", color: "#FF0000" },
                { label: "WhatsApp", href: `https://wa.me/${process.env.NEXT_PUBLIC_ADMIN_WHATSAPP ?? ""}`, color: "#25D366" },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 rounded-lg text-center font-body font-semibold text-sm transition-transform hover:-translate-y-0.5"
                  style={{ background: "#110E06", border: "1px solid rgba(201,168,76,0.1)", color: "#F5F0E8" }}
                >
                  {s.label}
                </a>
              ))}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
