import { useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { usePlayer } from "@/stores/player";

type AyahEd = { number: number; text: string; numberInSurah: number };
type EditionData = { ayahs: AyahEd[]; englishName?: string };
type ApiResp = { code: number; data: EditionData[] };

async function fetchSurahTranscript(id: number): Promise<{ arabic: AyahEd[]; roman: AyahEd[] }> {
  const res = await fetch(
    `https://api.alquran.cloud/v1/surah/${id}/editions/quran-uthmani,en.transliteration`,
  );
  if (!res.ok) throw new Error("Failed to load transcript");
  const json = (await res.json()) as ApiResp;
  return { arabic: json.data[0].ayahs, roman: json.data[1].ayahs };
}

export function TranscriptPanel() {
  const { current, showTranscript, toggleTranscript, progress, duration } = usePlayer();
  const containerRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<HTMLDivElement>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["transcript", current?.id],
    queryFn: () => fetchSurahTranscript(current!.id),
    enabled: !!current && showTranscript,
    staleTime: Infinity,
  });

  // Approximate active ayah from progress (linear estimate across verses)
  const totalAyahs = data?.arabic.length ?? current?.verses ?? 1;
  const activeIdx =
    duration > 0 ? Math.min(totalAyahs - 1, Math.floor((progress / duration) * totalAyahs)) : 0;

  useEffect(() => {
    if (!showTranscript || !activeRef.current) return;
    activeRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [activeIdx, showTranscript]);

  return (
    <AnimatePresence>
      {showTranscript && current && (
        <motion.div
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "100%", opacity: 0 }}
          transition={{ type: "spring", damping: 28, stiffness: 220 }}
          className="fixed inset-x-0 bottom-[88px] z-40 mx-auto max-w-3xl rounded-t-3xl border border-border bg-card/95 shadow-2xl backdrop-blur-xl md:bottom-[96px]"
          style={{ maxHeight: "60vh" }}
        >
          <div className="flex items-center justify-between border-b border-border px-5 py-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-foreground">
                Transcript · {current.id}. {current.name}
              </p>
              <p className="text-[11px] text-muted-foreground">
                Arabic & Roman transliteration · {totalAyahs} ayahs
              </p>
            </div>
            <button
              onClick={toggleTranscript}
              className="rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              aria-label="Close transcript"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div
            ref={containerRef}
            className="overflow-y-auto px-5 py-4"
            style={{ maxHeight: "calc(60vh - 60px)" }}
          >
            {isLoading && (
              <p className="py-8 text-center text-sm text-muted-foreground">Loading transcript…</p>
            )}
            {isError && (
              <p className="py-8 text-center text-sm text-destructive">
                Couldn't load transcript. Check your connection.
              </p>
            )}
            {data && (
              <div className="flex flex-col gap-5">
                {data.arabic.map((ayah, i) => {
                  const isActive = i === activeIdx;
                  return (
                    <div
                      key={ayah.number}
                      ref={isActive ? activeRef : undefined}
                      className={`rounded-xl border p-4 transition-colors ${
                        isActive
                          ? "border-primary/50 bg-primary/10"
                          : "border-transparent bg-muted/30"
                      }`}
                    >
                      <div className="mb-2 flex items-center gap-2">
                        <span
                          className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-medium ${
                            isActive
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {ayah.numberInSurah}
                        </span>
                      </div>
                      <p
                        dir="rtl"
                        lang="ar"
                        className="font-arabic text-2xl leading-loose text-foreground"
                      >
                        {ayah.text}
                      </p>
                      <p className="mt-2 text-sm italic leading-relaxed text-muted-foreground">
                        {data.roman[i]?.text}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
