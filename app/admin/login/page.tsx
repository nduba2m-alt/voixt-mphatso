"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Suspense } from "react";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const params = useSearchParams();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }
    router.push(params.get("redirect") ?? "/admin");
  }

  return (
    <form onSubmit={handleLogin} className="space-y-5">
      <div>
        <label className="block text-xs font-body uppercase tracking-widest mb-2" style={{ color: "#9A8F78" }}>Email</label>
        <input className="input-dark" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </div>
      <div>
        <label className="block text-xs font-body uppercase tracking-widest mb-2" style={{ color: "#9A8F78" }}>Password</label>
        <input className="input-dark" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      </div>
      {error && (
        <p className="text-sm font-body p-3 rounded" style={{ color: "#FF6B6B", background: "rgba(255,107,107,0.1)" }}>
          {error}
        </p>
      )}
      <button type="submit" className="btn-gold w-full py-4" disabled={loading}>
        {loading ? <Loader2 size={18} className="animate-spin mx-auto" /> : "Sign In"}
      </button>
    </form>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "#0A0804" }}>
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="font-display text-4xl gold-gradient mb-2">VOIXT</div>
          <div className="text-sm font-body" style={{ color: "#9A8F78" }}>Admin Portal</div>
        </div>
        <div className="card-dark p-8">
          <h1 className="font-display text-2xl mb-6" style={{ color: "#F5F0E8" }}>SIGN IN</h1>
          <Suspense>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
