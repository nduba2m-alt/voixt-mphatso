import Nav from "@/components/nav";
import Footer from "@/components/footer";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Music2 } from "lucide-react";

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

const SONGS = [
  "Song 1", "Song 2", "Song 3", "Song 4",
  "Song 5", "Song 6", "Song 7", "Song 8",
];

export default async function MphatsoPage() {
  const cms = await getCmsContent();

  return (
    <>
      <Nav />
      <main className="pt-24 pb-20">
        {/* Hero */}
        <section
          className="py-20 px-4 text-center"
          style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(201,168,76,0.1) 0%, transparent 60%), #0A0804" }}
        >
          <span className="text-xs font-body tracking-[0.3em] uppercase" style={{ color: "#C9A84C" }}>
            The Debut Album
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
            MPHATSO
          </h1>
          <p className="font-editorial text-xl mt-4" style={{ color: "#9A8F78", fontStyle: "italic" }}>
            by VOIXT
          </p>
        </section>

        <div className="max-w-3xl mx-auto px-4 space-y-16">
          {/* Description */}
          <section>
            <h2 className="font-display text-3xl mb-4" style={{ color: "#C9A84C" }}>ABOUT THE ALBUM</h2>
            <p className="font-body text-base leading-relaxed" style={{ color: "#9A8F78" }}>
              {cms.mphatso_description || "A story of identity, faith, and belonging — MPHATSO is VOIXT's debut album, a deeply personal and spiritually rich collection of music that speaks to the soul of every Zambian."}
            </p>
          </section>

          {/* Vision */}
          <section
            className="p-8 rounded-lg"
            style={{ background: "#110E06", border: "1px solid rgba(201,168,76,0.15)" }}
          >
            <h2 className="font-display text-2xl mb-4" style={{ color: "#C9A84C" }}>OUR VISION</h2>
            <p className="font-editorial text-lg leading-relaxed" style={{ color: "#F5F0E8", fontStyle: "italic" }}>
              "{cms.mphatso_vision || "To create music that speaks to the soul of every Zambian, pointing hearts to faith and purpose."}"
            </p>
          </section>

          {/* Songs */}
          <section>
            <h2 className="font-display text-3xl mb-6" style={{ color: "#C9A84C" }}>FEATURED SONGS</h2>
            <div className="grid grid-cols-2 gap-3">
              {SONGS.map((song, i) => (
                <div
                  key={song}
                  className="flex items-center gap-3 p-4 rounded-lg"
                  style={{ background: "#110E06", border: "1px solid rgba(201,168,76,0.1)" }}
                >
                  <Music2 size={16} style={{ color: "#C9A84C" }} />
                  <span className="text-sm font-body" style={{ color: "#F5F0E8" }}>{song}</span>
                  <span className="ml-auto text-xs font-body" style={{ color: "#9A8F78" }}>0{i + 1}</span>
                </div>
              ))}
            </div>
          </section>

          {/* YouTube Placeholder */}
          <section>
            <h2 className="font-display text-3xl mb-6" style={{ color: "#C9A84C" }}>WATCH</h2>
            <div
              className="rounded-lg flex items-center justify-center"
              style={{ aspectRatio: "16/9", background: "#110E06", border: "1px solid rgba(201,168,76,0.15)" }}
            >
              <div className="text-center">
                <div className="text-4xl mb-3">▶</div>
                <p className="text-sm font-body" style={{ color: "#9A8F78" }}>YouTube video coming soon</p>
              </div>
            </div>
          </section>

          <div className="text-center">
            <Link href="/tickets" className="btn-gold text-base px-12 py-4">
              Get Concert Tickets
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
