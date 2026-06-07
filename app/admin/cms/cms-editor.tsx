"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Loader2, CheckCircle } from "lucide-react";

interface CmsRow { id: string; key: string; value: string | null; }

const LABELS: Record<string, string> = {
  mphatso_description: "MPHATSO — Album Description",
  mphatso_vision: "MPHATSO — Album Vision",
  voixt_bio: "VOIXT — Group Biography",
  voixt_mission: "VOIXT — Mission",
  voixt_vision: "VOIXT — Vision",
  warren_bio: "Warren — Bio",
  nduva_bio: "Nduva — Bio",
  joash_bio: "Joash — Bio",
  nana_bio: "Nana (Ruth) — Bio",
  twaambo_bio: "Twaambo (Tiwa) — Bio",
  lusyomo_bio: "Lusyomo — Bio",
};

export default function CmsEditor({ initialContent }: { initialContent: CmsRow[] }) {
  const [content, setContent] = useState<Record<string, string>>(
    Object.fromEntries(initialContent.map((r) => [r.key, r.value ?? ""]))
  );
  const [saving, setSaving] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);

  async function save(key: string) {
    setSaving(key);
    const supabase = createClient();
    await supabase
      .from("cms_content")
      .update({ value: content[key], updated_at: new Date().toISOString() })
      .eq("key", key);
    setSaving(null);
    setSaved(key);
    setTimeout(() => setSaved(null), 2000);
  }

  return (
    <div className="space-y-6 max-w-3xl">
      {Object.keys(LABELS).map((key) => (
        <div key={key} className="card-dark p-6 space-y-3">
          <label className="block text-xs font-body uppercase tracking-widest" style={{ color: "#C9A84C" }}>
            {LABELS[key]}
          </label>
          <textarea
            className="input-dark"
            rows={key.endsWith("_bio") ? 3 : 4}
            value={content[key] ?? ""}
            onChange={(e) => setContent((prev) => ({ ...prev, [key]: e.target.value }))}
          />
          <div className="flex justify-end">
            <button
              onClick={() => save(key)}
              disabled={saving === key}
              className="btn-gold text-sm py-2 px-6 flex items-center gap-2"
            >
              {saving === key ? (
                <><Loader2 size={14} className="animate-spin" /> Saving...</>
              ) : saved === key ? (
                <><CheckCircle size={14} /> Saved!</>
              ) : (
                "Save"
              )}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
