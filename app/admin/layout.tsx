import Link from "next/link";
import AdminLogout from "./logout-button";

const NAV = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/tickets", label: "Tickets" },
  { href: "/admin/reports", label: "Reports" },
  { href: "/admin/cms", label: "CMS" },
  { href: "/admin/checkin", label: "Check-In" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#0A0804" }}>
      <header
        style={{ background: "#060503", borderBottom: "1px solid rgba(201,168,76,0.15)" }}
        className="sticky top-0 z-40"
      >
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-14">
          <div className="flex items-center gap-6">
            <Link href="/admin" className="font-display text-xl tracking-widest gold-gradient">
              VOIXT Admin
            </Link>
            <nav className="hidden md:flex items-center gap-5">
              {NAV.map((n) => (
                <Link key={n.href} href={n.href} className="text-xs font-body uppercase tracking-widest transition-colors hover:text-[#C9A84C]" style={{ color: "#9A8F78" }}>
                  {n.label}
                </Link>
              ))}
            </nav>
          </div>
          <AdminLogout />
        </div>
      </header>
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8">{children}</main>
    </div>
  );
}
