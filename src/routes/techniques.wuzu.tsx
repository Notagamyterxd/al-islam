import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Droplets } from "lucide-react";

export const Route = createFileRoute("/techniques/wuzu")({
  head: () => ({
    meta: [
      { title: "Wuzu ka Tareeka — Step-by-step Ablution" },
      {
        name: "description",
        content:
          "Learn the correct step-by-step method of performing Wuzu (ablution) according to the Sunnah.",
      },
    ],
  }),
  component: WuzuPage,
});

const steps = [
  { t: "Niyyah (Intention)", d: "Make the intention in your heart that you are performing Wuzu for the sake of Allah." },
  { t: "Bismillah", d: "Begin by saying ‘Bismillah’ (In the name of Allah)." },
  { t: "Wash the hands", d: "Wash both hands up to the wrists three times, ensuring water reaches between the fingers." },
  { t: "Rinse the mouth", d: "Take water into the right hand and rinse the mouth three times (Madmadah)." },
  { t: "Clean the nose", d: "Sniff water into the nostrils with the right hand and blow it out with the left, three times (Istinshaq)." },
  { t: "Wash the face", d: "Wash the entire face three times — from the hairline to the chin and from ear to ear." },
  { t: "Wash the arms", d: "Wash the right arm up to and including the elbow three times, then the left arm the same way." },
  { t: "Wipe the head (Masah)", d: "Wet your hands and wipe over the head once, from the forehead to the back of the head and back." },
  { t: "Wipe the ears", d: "Using the same wetness, wipe the inside of the ears with the index fingers and the back with the thumbs." },
  { t: "Wash the feet", d: "Wash the right foot up to and including the ankle three times, then the left foot the same way, cleaning between the toes." },
  { t: "Dua after Wuzu", d: "Recite: ‘Ashhadu an la ilaha illa-llah, wahdahu la sharika lah, wa ashhadu anna Muhammadan ‘abduhu wa rasuluh.’" },
];

function WuzuPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-16">
      <Link to="/techniques" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-3.5 w-3.5" /> Techniques
      </Link>

      <div className="mt-6 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-cyan-400 shadow-glow">
          <Droplets className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="font-display text-3xl text-foreground sm:text-4xl">Wuzu ka Tareeka</h1>
          <p className="text-sm text-muted-foreground">The step-by-step method of ablution</p>
        </div>
      </div>

      <ol className="mt-8 space-y-3">
        {steps.map((s, i) => (
          <li key={i} className="flex gap-4 rounded-2xl border border-border bg-card p-4">
            <span className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
              {i + 1}
            </span>
            <div className="min-w-0">
              <h3 className="font-medium text-foreground">{s.t}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{s.d}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
