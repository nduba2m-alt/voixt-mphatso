"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import AdminLogout from "./logout-button";
import {
  LayoutDashboard,
  ClipboardList,
  Ticket,
  BarChart2,
  FileText,
  ScanLine,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/orders", label: "Orders", icon: ClipboardList },
  { href: "/admin/tickets", label: "Tickets", icon: Ticket },
  { href: "/admin/reports", label: "Reports", icon: BarChart2 },
  { href: "/admin/cms", label: "CMS", icon: FileText },
  { href: "/admin/checkin", label: "Check-In", icon: ScanLine },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#0A0804" }}>
      {/* Header */}
      <header
        style={{ background: "#060503", borderBottom: "1px solid rgba(201,168,76,0.15)" }}
        className="sticky top-0 z-50"
      >
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-14">
          <div className="flex items-center gap-6">
            <Link href="/admin" className="font-display text-xl tracking-widest gold-gradient">
              VOIXT Admin
            </Link>
            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-5">
              {NAV.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="text-xs font-body uppercase tracking-widest transition-colors hover:text-[#C9A84C]"
                  style={{ color: pathname === href ? "#C9A84C" : "#9A8F78" }}
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <AdminLogout />
            {/* Mobile hamburger */}
            <button
              className="md:hidden p-2"
              style={{ color: "#C9A84C" }}
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown nav */}
        {mobileOpen && (
          <div
            className="md:hidden px-4 pb-4"
            style={{ background: "#060503", borderTop: "1px solid rgba(201,168,76,0.1)" }}
          >
            {NAV.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 py-3 text-sm font-body"
                style={{
                  color: pathname === href ? "#C9A84C" : "#9A8F78",
                  borderBottom: "1px solid rgba(201,168,76,0.08)",
                }}
              >
                <Icon size={16} />
                {label}
              </Link>
            ))}
          </div>
        )}
      </header>

      {/* Bottom tab bar for mobile */}
      <div
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex"
        style={{ background: "#060503", borderTop: "1px solid rgba(201,168,76,0.15)" }}
      >
        {NAV.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="flex-1 flex flex-col items-center justify-center py-2 gap-0.5"
            style={{ color: pathname === href ? "#C9A84C" : "#9A8F78" }}
          >
            <Icon size={18} />
            <span className="text-[9px] font-body uppercase tracking-wide">{label}</span>
          </Link>
        ))}
      </div>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-6 pb-24 md:pb-6">
        {children}
      </main>
    </div>
  );
}
