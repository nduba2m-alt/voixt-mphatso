"use client";
import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const links = [
  { href: "/", label: "Home" },
  { href: "/about/mphatso", label: "MPHATSO" },
  { href: "/about/voixt", label: "VOIXT" },
  { href: "/event", label: "Event" },
  { href: "/media", label: "Media" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);
  return (
    <nav
      style={{ background: "rgba(10,8,4,0.95)", borderBottom: "1px solid rgba(201,168,76,0.12)" }}
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md"
    >
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-16">
        <Link href="/" className="font-display text-2xl tracking-widest gold-gradient">
          VOIXT
        </Link>
        <div className="hidden md:flex items-center gap-7">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm font-body transition-colors hover:text-[#C9A84C]"
              style={{ color: "#9A8F78" }}
            >
              {l.label}
            </Link>
          ))}
          <Link href="/tickets" className="btn-gold text-sm py-2 px-6">
            Get Tickets
          </Link>
        </div>
        <button
          className="md:hidden p-2"
          style={{ color: "#C9A84C" }}
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
      {open && (
        <div
          className="md:hidden px-4 pb-4 flex flex-col gap-3"
          style={{ background: "#0A0804" }}
        >
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="py-2 text-sm font-body"
              style={{ color: "#9A8F78", borderBottom: "1px solid rgba(201,168,76,0.1)" }}
            >
              {l.label}
            </Link>
          ))}
          <Link href="/tickets" className="btn-gold text-center text-sm py-3 mt-2" onClick={() => setOpen(false)}>
            Get Tickets
          </Link>
        </div>
      )}
    </nav>
  );
}
