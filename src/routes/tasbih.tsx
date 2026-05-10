import { createFileRoute, Link } from "@tanstack/react-router";
import { Sparkles, RotateCcw } from "lucide-react";
import { useTasbih, type Dhikr } from "@/hooks/use-tasbih";

export const Route = createFileRoute("/tasbih")({
  head: () => ({
    meta: [
      { title: "Tasbih Counter — Digital Dhikr Counter" },
      { name: "description", content: "Track your daily Tasbih and Dhikr. 100 beads per round with monthly progress." },
    ],
  }),
  component: TasbihPage,
});

const DHIKRS: { value: Dhikr; arabic: string; meaning: string }[] = [
  { value: "SubhanAllah", arabic: "سُبْحَانَ اللَّه", meaning: "Glory be to Allah" },
  { value: "Alhamdulillah", arabic: "اَلْحَمْدُ لِلَّٰه", meaning: "Praise be to Allah" },
  { value: "Allahu Akbar", arabic: "اللَّهُ أَكْبَر", meaning: "Allah is the Greatest" },
];

function TasbihPage() {
  const { dhikr, setDhikr, count, rounds, increment, reset, isAuthed, totalMonthRounds, totalMonthBeads } = useTasbih();
  const active = DHIKRS.find((d) => d.value === dhikr)!;
  const progress = (count / 100) * 100;

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 sm:py-16">
      <div className="text-center">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent-2 shadow-glow">
          <Sparkles className="h-6 w-6 text-primary-foreground" />
        </div>
        <h1 className="font-display text-4xl text-foreground sm:text-6xl">Tasbih</h1>
        <p className="mt-3 text-sm text-muted-foreground">Tap to count · 100 beads = 1 round</p>
      </div>

      {!isAuthed && (
        <div className="mt-6 rounded-2xl border border-border bg-card p-4 text-center text-sm text-muted-foreground">
          <Link to="/auth" className="text-primary underline">Sign in</Link> to save your counts and track monthly progress.
        </div>
      )}

      <div className="mt-6 flex justify-center gap-2">
        {DHIKRS.map((d) => (
          <button
            key={d.value}
            onClick={() => setDhikr(d.value)}
            className={`rounded-full border px-3 py-1.5 text-xs transition-colors ${
              dhikr === d.value
                ? "border-primary/50 bg-primary/10 text-primary"
                : "border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {d.value}
          </button>
        ))}
      </div>

      <div className="mt-8 rounded-3xl border border-border bg-card p-6 text-center">
        <p className="font-arabic text-5xl text-foreground" dir="rtl">{active.arabic}</p>
        <p className="mt-2 text-xs text-muted-foreground">{active.meaning}</p>
      </div>

      <button
        onClick={isAuthed ? increment : undefined}
        disabled={!isAuthed}
        className="mt-6 flex h-64 w-full select-none flex-col items-center justify-center rounded-3xl bg-gradient-to-br from-primary to-accent-2 text-primary-foreground shadow-glow transition-transform active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
      >
        <span className="font-display text-7xl">{count}</span>
        <span className="mt-2 text-sm opacity-80">Tap to count</span>
      </button>

      <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-muted">
        <div className="h-full bg-primary transition-all" style={{ width: `${progress}%` }} />
      </div>

      <div className="mt-6 grid grid-cols-3 gap-3 text-center">
        <Stat label="Today's Rounds" value={rounds} />
        <Stat label="Month Rounds" value={totalMonthRounds} />
        <Stat label="Month Beads" value={totalMonthBeads} />
      </div>

      <button
        onClick={reset}
        className="mx-auto mt-6 flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-xs text-muted-foreground transition-colors hover:text-foreground"
      >
        <RotateCcw className="h-3.5 w-3.5" /> Reset current session
      </button>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-3">
      <p className="font-display text-2xl text-foreground">{value}</p>
      <p className="text-[11px] text-muted-foreground">{label}</p>
    </div>
  );
}
