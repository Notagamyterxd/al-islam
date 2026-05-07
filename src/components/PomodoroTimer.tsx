import { useEffect, useRef, useState } from "react";
import { Play, Pause, RotateCcw, Coffee, BookOpen } from "lucide-react";
import { motion } from "framer-motion";

type Mode = "focus" | "break";

const DURATIONS: Record<Mode, number> = { focus: 25 * 60, break: 5 * 60 };

export function PomodoroTimer() {
  const [mode, setMode] = useState<Mode>("focus");
  const [seconds, setSeconds] = useState(DURATIONS.focus);
  const [running, setRunning] = useState(false);
  const [sessions, setSessions] = useState(0);
  const ref = useRef<number | null>(null);

  useEffect(() => {
    if (!running) return;
    ref.current = window.setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) {
          setRunning(false);
          if (mode === "focus") {
            setSessions((n) => n + 1);
            setMode("break");
            return DURATIONS.break;
          }
          setMode("focus");
          return DURATIONS.focus;
        }
        return s - 1;
      });
    }, 1000);
    return () => {
      if (ref.current) window.clearInterval(ref.current);
    };
  }, [running, mode]);

  const reset = () => {
    setRunning(false);
    setSeconds(DURATIONS[mode]);
  };

  const switchMode = (m: Mode) => {
    setMode(m);
    setSeconds(DURATIONS[m]);
    setRunning(false);
  };

  const total = DURATIONS[mode];
  const pct = ((total - seconds) / total) * 100;
  const min = Math.floor(seconds / 60);
  const sec = seconds % 60;

  return (
    <div className="rounded-3xl border border-border bg-card p-8">
      <div className="mb-6 flex justify-center gap-2">
        <button
          onClick={() => switchMode("focus")}
          className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs transition-colors ${
            mode === "focus" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <BookOpen className="h-3 w-3" /> Focus
        </button>
        <button
          onClick={() => switchMode("break")}
          className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs transition-colors ${
            mode === "break" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Coffee className="h-3 w-3" /> Break
        </button>
      </div>

      <div className="relative mx-auto aspect-square w-56">
        <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="2" fill="none" className="text-muted" />
          <motion.circle
            cx="50"
            cy="50"
            r="45"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            className="text-primary"
            style={{
              strokeDasharray: 2 * Math.PI * 45,
              strokeDashoffset: 2 * Math.PI * 45 * (1 - pct / 100),
              filter: "drop-shadow(0 0 8px var(--primary))",
            }}
            transition={{ duration: 0.5 }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-display text-5xl tabular-nums text-foreground">
            {min.toString().padStart(2, "0")}:{sec.toString().padStart(2, "0")}
          </span>
          <span className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">
            {mode === "focus" ? "Study time" : "Take a break"}
          </span>
        </div>
      </div>

      <div className="mt-6 flex justify-center gap-3">
        <button
          onClick={() => setRunning((r) => !r)}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-glow transition-transform hover:scale-105"
        >
          {running ? <Pause className="h-5 w-5" /> : <Play className="ml-0.5 h-5 w-5" />}
        </button>
        <button
          onClick={reset}
          className="flex h-12 w-12 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <RotateCcw className="h-4 w-4" />
        </button>
      </div>

      <p className="mt-6 text-center text-xs text-muted-foreground">
        Sessions completed today · <span className="text-foreground">{sessions}</span>
      </p>
    </div>
  );
}
