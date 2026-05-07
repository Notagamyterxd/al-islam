import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { remindersAudios } from "@/data/audios";
import { AudioCard } from "@/components/AudioCard";

export const Route = createFileRoute("/reminders")({
  head: () => ({
    meta: [
      { title: "Reminders & Duas — Sukoon" },
      { name: "description", content: "Short Islamic reminders, Quran recitations and daily duas to ground your day." },
      { property: "og:title", content: "Reminders & Duas — Sukoon" },
      { property: "og:description", content: "Short Islamic reminders, Quran recitations and daily duas." },
    ],
  }),
  component: RemindersPage,
});

const FILTERS = [
  { id: "all", label: "All" },
  { id: "quran", label: "Quran" },
  { id: "dua", label: "Duas" },
  { id: "reminder", label: "Reminders" },
] as const;

function RemindersPage() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["id"]>("all");
  const list = filter === "all" ? remindersAudios : remindersAudios.filter((a) => a.category === filter);

  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
      <div className="max-w-2xl">
        <p className="text-xs uppercase tracking-widest text-primary">For the soul</p>
        <h1 className="mt-3 font-display text-5xl text-foreground md:text-6xl">Reminders & Duas</h1>
        <p className="mt-4 text-muted-foreground">
          A small collection to begin or close your day with intention. Tap any card to play.
        </p>
      </div>

      <div className="mt-10 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`rounded-full px-4 py-1.5 text-xs transition-colors ${
              filter === f.id
                ? "bg-primary text-primary-foreground shadow-glow"
                : "border border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {list.map((track, i) => (
          <AudioCard key={track.id} track={track} queue={list} index={i} />
        ))}
      </div>
    </div>
  );
}
