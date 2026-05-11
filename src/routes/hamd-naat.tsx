import { createFileRoute } from "@tanstack/react-router";
import { HamdNaatSection } from "@/components/HamdNaatSection";
import { Music2 } from "lucide-react";

export const Route = createFileRoute("/hamd-naat")({
  head: () => ({
    meta: [
      { title: "Hamd & Naat — Devotional Recitations" },
      {
        name: "description",
        content:
          "Listen to beautiful Hamd and Naat — praises of Allah and the Prophet ﷺ recited by renowned artists.",
      },
    ],
  }),
  component: HamdNaatPage,
});

function HamdNaatPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-16">
      <div className="text-center">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-accent-2 to-primary shadow-glow">
          <Music2 className="h-6 w-6 text-primary-foreground" />
        </div>
        <h1 className="font-display text-4xl text-foreground sm:text-6xl">
          Hamd &amp; Naat
        </h1>
        <p className="mt-3 text-sm text-muted-foreground sm:text-base">
          Devotional praises of Allah and the Prophet ﷺ
        </p>
      </div>

      <HamdNaatSection hideHeader />
    </div>
  );
}
