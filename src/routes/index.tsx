import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, BookOpen } from "lucide-react";
import { surahs } from "@/data/surahs";
import { SurahRow } from "@/components/SurahRow";
import { usePlayer } from "@/stores/player";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Al-Islam Audio Player — Listen to all 114 Surahs" },
      { name: "description", content: "Stream high-quality recitations of all 114 Surahs of the Holy Quran. Search, favorite and listen with a clean, ad-free player." },
      { property: "og:title", content: "Al-Islam Audio Player" },
      { property: "og:description", content: "Listen to all 114 Surahs of the Holy Quran with high-quality recitations." },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const [q, setQ] = useState("");
  const { autoPlay, toggleAutoPlay } = usePlayer();

  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return surahs;
    return surahs.filter(
      (s) =>
        String(s.id) === t ||
        s.name.toLowerCase().includes(t) ||
        s.translated.toLowerCase().includes(t) ||
        s.arabic.includes(t),
    );
  }, [q]);

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-16">
      <div className="text-center">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent-2 shadow-glow">
          <BookOpen className="h-6 w-6 text-primary-foreground" />
        </div>
        <h1 className="font-display text-4xl text-foreground sm:text-6xl">Al-Islam</h1>
        <p className="mt-3 text-sm text-muted-foreground sm:text-base">
          Listen to all 114 Surahs · recited by Mishary Rashid Alafasy
        </p>
      </div>

      <div className="sticky top-16 z-30 mt-12 -mx-4 bg-background/80 px-4 py-3 backdrop-blur-xl sm:mx-0 sm:rounded-2xl sm:px-4">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search Surah by name or number…"
              className="w-full rounded-full border border-border bg-card py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <button
            onClick={toggleAutoPlay}
            className={`flex-none rounded-full border px-3 py-2 text-xs transition-colors ${
              autoPlay
                ? "border-primary/50 bg-primary/10 text-primary"
                : "border-border text-muted-foreground hover:text-foreground"
            }`}
            title="Auto-play next Surah when current finishes"
          >
            Auto-play {autoPlay ? "On" : "Off"}
          </button>
        </div>
        <p className="mt-2 px-1 text-[11px] text-muted-foreground">
          {filtered.length} of {surahs.length} Surahs
        </p>
      </div>

      <div className="mt-4 flex flex-col gap-2">
        {filtered.map((s, i) => (
          <SurahRow key={s.id} surah={s} queue={filtered} index={i} />
        ))}
        {filtered.length === 0 && (
          <p className="py-12 text-center text-sm text-muted-foreground">
            No Surah matches "{q}".
          </p>
        )}
      </div>
    </div>
  );
}
