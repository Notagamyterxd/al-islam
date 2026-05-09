import { useEffect, useRef, useState } from "react";
import { Play, Pause, SkipBack, SkipForward, Volume2, X, Repeat, Repeat1, Gauge, FileText } from "lucide-react";
import { usePlayer } from "@/stores/player";
import { Slider } from "@/components/ui/slider";
import { motion, AnimatePresence } from "framer-motion";
import { audioUrl } from "@/data/surahs";

const fmt = (s: number) => {
  if (!isFinite(s) || s < 0) return "0:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
};

export function AudioPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [showSpeed, setShowSpeed] = useState(false);
  const {
    current,
    isPlaying,
    progress,
    duration,
    volume,
    seek,
    loop,
    autoPlay,
    playbackRate,
    showTranscript,
    toggle,
    next,
    setProgress,
    setDuration,
    setVolume,
    requestSeek,
    clearSeek,
    stop,
    toggleLoop,
    setPlaybackRate,
    toggleTranscript,
  } = usePlayer();

  useEffect(() => {
    const a = audioRef.current;
    if (!a || !current) return;
    const url = audioUrl(current.id);
    if (a.src !== url) a.src = url;
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
    if (!a) return;
    a.loop = loop;
  }, [loop]);

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    a.playbackRate = playbackRate;
  }, [playbackRate, current]);

  useEffect(() => {
    const a = audioRef.current;
    if (!a || seek == null) return;
    a.currentTime = seek;
    clearSeek();
  }, [seek, clearSeek]);

  const onEnded = () => {
    if (loop) return; // handled by audio element loop
    if (autoPlay) next();
    else usePlayer.setState({ isPlaying: false });
  };

  return (
    <>
      <audio
        ref={audioRef}
        onTimeUpdate={(e) => setProgress(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onEnded={onEnded}
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
                <div className="flex h-12 w-12 flex-none items-center justify-center rounded-md bg-gradient-to-br from-primary to-accent-2 shadow-glow">
                  <span className="text-xs font-medium text-primary-foreground">{current.id}</span>
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">
                    {current.id}. {current.name}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {current.translated} · {current.verses} ayahs
                  </p>
                </div>
              </div>

              {/* Controls */}
              <div className="flex flex-col items-center gap-1.5 md:flex-1">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => usePlayer.getState().prev()}
                    className="text-muted-foreground transition-colors hover:text-foreground"
                    aria-label="Previous Surah"
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
                    aria-label="Next Surah"
                  >
                    <SkipForward className="h-4 w-4" />
                  </button>
                  <button
                    onClick={toggleLoop}
                    className={`transition-colors ${loop ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
                    aria-label="Loop Surah"
                  >
                    {loop ? <Repeat1 className="h-4 w-4" /> : <Repeat className="h-4 w-4" />}
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
                onClick={stop}
                className="hidden text-muted-foreground transition-colors hover:text-foreground md:block"
                aria-label="Close player"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            {/* Mobile seek bar */}
            <div className="flex w-full items-center gap-2 px-4 pb-2 md:hidden">
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
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
