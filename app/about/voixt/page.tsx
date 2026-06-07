import Nav from "@/components/nav";
import Footer from "@/components/footer";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

async function getCmsContent() {
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("cms_content").select("key, value");
    const map: Record<string, string> = {};
    data?.forEach((row) => { map[row.key] = row.value ?? ""; });
    return map;
  } catch {
    return {} as Record<string, string>;
  }
}

const MEMBERS = [
  { key: "warren", name: "Warren", role: "Vocals" },
  { key: "nduva", name: "Nduva", role: "Vocals" },
  { key: "joash", name: "Joash", role: "Vocals" },
  { key: "nana", name: "Nana (Ruth)", role: "Vocals" },
  { key: "twaambo", name: "Twaambo (Tiwa)", role: "Vocals" },
  { key: "lusyomo", name: "Lusyomo", role: "Vocals" },
];

const DEFAULTS: Record<string, string> = {
  warren_bio: "Warren is a founding member of VOIXT with a powerful tenor voice.",
  nduva_bio: "Nduva brings a rich vocal texture to the group with soulful depth.",
  joash_bio: "Joash is the energetic heartbeat of VOIXT, full of passion and warmth.",
  nana_bio: "Nana (Ruth) leads with warmth and precision in every performance.",
  twaambo_bio: "Twaambo (Tiwa) adds depth and harmony to every song.",
  lusyomo_bio: "Lusyomo rounds out the ensemble with a powerful bass tone.",
};

export default async function VoixtPage() {
  const cms = await getCmsContent();

  return (
    <>
      <Nav />
      <main className="pt-24 pb-20">
        <section
          className="py-20 px-4 text-center"
          style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(201,168,76,0.08) 0%, transparent 60%), #0A0804" }}
        >
          <span className="text-xs font-body tracking-[0.3em] uppercase" style={{ color: "#C9A84C" }}>
            The Group
          </span>
          <h1
            className="font-display mt-3"
            style={{
              fontSize: "clamp(4rem, 15vw, 10rem)",
              lineHeight: 0.9,
              background: "linear-gradient(135deg, #8B6914 0%, #C9A84C 40%, #E8C97A 60%, #C9A84C 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            VOIXT
          </h1>
        </section>

        <div className="max-w-4xl mx-auto px-4 space-y-16">
          {/* Biography */}
          <section>
            <h2 className="font-display text-3xl mb-4" style={{ color: "#C9A84C" }}>OUR STORY</h2>
            <p className="font-body text-base leading-relaxed" style={{ color: "#9A8F78" }}>
              {cms.voixt_bio || "VOIXT is a six-member gospel and contemporary music group from Zambia, united by a shared calling to glorify God through excellence in music and ministry."}
            </p>
          </section>

          {/* Mission & Vision */}
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { label: "Mission", key: "voixt_mission", default: "To glorify God through excellence in music and ministry." },
              { label: "Vision", key: "voixt_vision", default: "To be a voice of hope and faith across Africa and beyond." },
            ].map((item) => (
              <div
                key={item.key}
                className="p-8 rounded-lg"
                style={{ background: "#110E06", border: "1px solid rgba(201,168,76,0.15)" }}
              >
                <h3 className="font-display text-xl mb-3" style={{ color: "#C9A84C" }}>{item.label.toUpperCase()}</h3>
                <p className="font-editorial text-lg leading-relaxed" style={{ color: "#F5F0E8", fontStyle: "italic" }}>
                  "{cms[item.key] || item.default}"
                </p>
              </div>
            ))}
          </div>

          {/* Members */}
          <section>
            <h2 className="font-display text-3xl mb-8" style={{ color: "#C9A84C" }}>THE MEMBERS</h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
              {MEMBERS.map((m) => (
                <div
                  key={m.key}
                  className="p-6 rounded-lg"
                  style={{ background: "#110E06", border: "1px solid rgba(201,168,76,0.12)" }}
                >
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center mb-4 font-display text-2xl"
                    style={{ background: "rgba(201,168,76,0.1)", color: "#C9A84C", border: "1px solid rgba(201,168,76,0.25)" }}
                  >
                    {m.name[0]}
                  </div>
                  <h3 className="font-display text-xl mb-0.5" style={{ color: "#F5F0E8" }}>
                    {m.name}
                  </h3>
                  <div className="text-xs font-body tracking-widest uppercase mb-3" style={{ color: "#C9A84C" }}>
                    {m.role}
                  </div>
                  <p className="text-sm font-body leading-relaxed" style={{ color: "#9A8F78" }}>
                    {cms[`${m.key}_bio`] || DEFAULTS[`${m.key}_bio`]}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Gallery placeholder */}
          <section>
            <h2 className="font-display text-3xl mb-6" style={{ color: "#C9A84C" }}>GALLERY</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-lg"
                  style={{ aspectRatio: "1", background: "#110E06", border: "1px solid rgba(201,168,76,0.1)" }}
                />
              ))}
            </div>
            <p className="text-xs font-body mt-3 text-center" style={{ color: "#4A4535" }}>
              Photos will be added shortly. Replace placeholders with Supabase media bucket images.
            </p>
          </section>

          <div className="text-center">
            <Link href="/tickets" className="btn-gold text-base px-12 py-4">
              Come See Us Live
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
