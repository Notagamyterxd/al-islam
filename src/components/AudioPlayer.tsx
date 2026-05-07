import { useEffect, useRef } from "react";
import { Play, Pause, SkipBack, SkipForward, Volume2, X } from "lucide-react";
import { usePlayer } from "@/stores/player";
import { Slider } from "@/components/ui/slider";
import { motion, AnimatePresence } from "framer-motion";

const fmt = (s: number) => {
  if (!isFinite(s) || s < 0) return "0:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
};

export function AudioPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const {
    current,
    isPlaying,
    progress,
    duration,
    volume,
    seek,
    toggle,
    next,
    prev,
    setProgress,
    setDuration,
    setVolume,
    requestSeek,
    clearSeek,
    play,
  } = usePlayer();

  useEffect(() => {
    const a = audioRef.current;
    if (!a || !current) return;
    if (a.src !== current.url) a.src = current.url;
    if (isPlaying) a.play().catch(() => {});
    else a.pause();
  }, [current, isPlaying]);

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    a.volume = volume;
  }, [volume]);

  useEffect(() => {
    const a = audioRef.current;
    if (!a || seek == null) return;
    a.currentTime = seek;
    clearSeek();
  }, [seek, clearSeek]);

  return (
    <>
      <audio
        ref={audioRef}
        onTimeUpdate={(e) => setProgress(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onEnded={next}
      />
      <AnimatePresence>
        {current && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card/95 backdrop-blur-xl"
          >
            <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 md:gap-6 md:px-6">
              {/* Track info */}
              <div className="flex min-w-0 flex-1 items-center gap-3">
                <div
                  className={`h-12 w-12 flex-none rounded-md bg-gradient-to-br ${current.gradient} shadow-glow`}
                />
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">{current.title}</p>
                  <p className="truncate text-xs text-muted-foreground">{current.author}</p>
                </div>
              </div>

              {/* Controls */}
              <div className="flex flex-col items-center gap-1.5 md:flex-1">
                <div className="flex items-center gap-3">
                  <button
                    onClick={prev}
                    className="text-muted-foreground transition-colors hover:text-foreground"
                    aria-label="Previous"
                  >
                    <SkipBack className="h-4 w-4" />
                  </button>
                  <button
                    onClick={toggle}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-glow transition-transform hover:scale-105"
                    aria-label={isPlaying ? "Pause" : "Play"}
                  >
                    {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="ml-0.5 h-4 w-4" />}
                  </button>
                  <button
                    onClick={next}
                    className="text-muted-foreground transition-colors hover:text-foreground"
                    aria-label="Next"
                  >
                    <SkipForward className="h-4 w-4" />
                  </button>
                </div>
                <div className="hidden w-full items-center gap-2 md:flex">
                  <span className="w-10 text-right text-[10px] tabular-nums text-muted-foreground">
                    {fmt(progress)}
                  </span>
                  <Slider
                    value={[progress]}
                    max={duration || 100}
                    step={0.1}
                    onValueChange={(v) => requestSeek(v[0])}
                    className="flex-1"
                  />
                  <span className="w-10 text-[10px] tabular-nums text-muted-foreground">
                    {fmt(duration)}
                  </span>
                </div>
              </div>

              {/* Volume + close */}
              <div className="hidden items-center gap-2 md:flex md:w-32">
                <Volume2 className="h-4 w-4 flex-none text-muted-foreground" />
                <Slider
                  value={[volume * 100]}
                  max={100}
                  step={1}
                  onValueChange={(v) => setVolume(v[0] / 100)}
                />
              </div>
              <button
                onClick={() => play(null as never, [])}
                className="hidden text-muted-foreground transition-colors hover:text-foreground md:block"
                aria-label="Close player"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
