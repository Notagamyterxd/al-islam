import { Check, Lock, Clock } from "lucide-react";
import type { PrayerName } from "@/hooks/use-prayer-times";

interface Props {
  name: PrayerName;
  time: string;
  isPast: boolean;
  isNext: boolean;
  isCompleted: boolean;
  onToggle: () => void;
  disabled?: boolean;
}

export function PrayerCard({ name, time, isPast, isNext, isCompleted, onToggle, disabled }: Props) {
  return (
    <div
      className={`flex items-center justify-between rounded-2xl border p-4 transition-colors ${
        isCompleted
          ? "border-primary/40 bg-primary/10"
          : isNext
          ? "border-accent-2/50 bg-card"
          : "border-border bg-card"
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${
            isCompleted ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
          }`}
        >
          {isCompleted ? <Check className="h-5 w-5" /> : <Clock className="h-5 w-5" />}
        </div>
        <div>
          <p className="font-display text-lg text-foreground">{name}</p>
          <p className="text-xs text-muted-foreground">
            {time}
            {isNext && !isCompleted && <span className="ml-2 text-accent-2">· Next</span>}
          </p>
        </div>
      </div>
      <button
        onClick={onToggle}
        disabled={disabled || !isPast}
        title={!isPast ? "Available after prayer time" : isCompleted ? "Mark as not prayed" : "Mark as prayed"}
        className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs transition-colors ${
          !isPast
            ? "cursor-not-allowed border-border/50 bg-muted/30 text-muted-foreground"
            : isCompleted
            ? "border-primary/50 bg-primary/20 text-primary hover:bg-primary/30"
            : "border-border bg-card text-foreground hover:bg-muted"
        }`}
      >
        {!isPast ? <Lock className="h-3 w-3" /> : isCompleted ? <Check className="h-3 w-3" /> : null}
        {!isPast ? "Locked" : isCompleted ? "Prayed" : "Mark prayed"}
      </button>
    </div>
  );
}
