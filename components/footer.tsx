import Link from "next/link";

export default function Footer() {
  return (
    <footer
      style={{ background: "#060503", borderTop: "1px solid rgba(201,168,76,0.12)" }}
      className="py-10 mt-auto"
    >
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <div className="font-display text-3xl tracking-widest gold-gradient mb-1">VOIXT</div>
            <p className="text-xs font-body" style={{ color: "#9A8F78" }}>
              MPHATSO Album Launch Concert · 1 August 2026
            </p>
          </div>
          <div className="flex gap-5">
            {[
              { href: "https://facebook.com", label: "Facebook" },
              { href: "https://instagram.com", label: "Instagram" },
              { href: "https://youtube.com", label: "YouTube" },
            ].map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-body transition-colors hover:text-[#C9A84C]"
                style={{ color: "#9A8F78" }}
              >
                {s.label}
              </a>
            ))}
          </div>
          <Link href="/tickets" className="btn-gold text-sm py-2 px-6">
            Get Tickets
          </Link>
        </div>
        <p className="text-center text-xs mt-8" style={{ color: "#4A4535" }}>
          © 2026 VOIXT. All rights reserved. · #Mphatso2026
        </p>
      </div>
    </footer>
  );
}
