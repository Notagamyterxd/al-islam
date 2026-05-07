import { createFileRoute } from "@tanstack/react-router";
import { musicAudios } from "@/data/audios";
import { AudioCard } from "@/components/AudioCard";
import { PomodoroTimer } from "@/components/PomodoroTimer";

export const Route = createFileRoute("/music")({
  head: () => ({
    meta: [
      { title: "Chill Study Music — Sukoon" },
      { name: "description", content: "Lofi, ambient and nature sounds with a built-in Pomodoro timer to help you focus." },
      { property: "og:title", content: "Chill Study Music — Sukoon" },
      { property: "og:description", content: "Lofi, ambient and nature sounds with a Pomodoro timer." },
    ],
  }),
  component: MusicPage,
});

function MusicPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
      <div className="max-w-2xl">
        <p className="text-xs uppercase tracking-widest text-primary">For the work</p>
        <h1 className="mt-3 font-display text-5xl text-foreground md:text-6xl">Chill music & focus</h1>
        <p className="mt-4 text-muted-foreground">
          Press play, set a timer, and get to it. Built for homework, revision and deep work.
        </p>
      </div>

      <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_360px]">
        <div>
          <h2 className="mb-6 font-display text-2xl text-foreground">Pick a soundscape</h2>
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {musicAudios.map((track, i) => (
              <AudioCard key={track.id} track={track} queue={musicAudios} index={i} />
            ))}
          </div>
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <h2 className="mb-6 font-display text-2xl text-foreground">Study timer</h2>
          <PomodoroTimer />
        </aside>
      </div>
    </div>
  );
}
