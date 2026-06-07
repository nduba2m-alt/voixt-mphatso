"use client";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function AdminLogout() {
  const router = useRouter();
  async function logout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
  }
  return (
    <button onClick={logout} className="text-xs font-body uppercase tracking-widest transition-colors hover:text-[#FF6B6B]" style={{ color: "#9A8F78" }}>
      Sign Out
    </button>
  );
}
