import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Moon } from "lucide-react";

export const Route = createFileRoute("/techniques/namaz")({
  head: () => ({
    meta: [
      { title: "Namaz ka Tareeka — Step-by-step Salah" },
      {
        name: "description",
        content:
          "Learn the correct step-by-step method of performing Namaz (Salah) according to the Sunnah.",
      },
    ],
  }),
  component: NamazPage,
});

const steps = [
  { t: "Niyyah (Intention)", d: "Stand facing the Qiblah and make the intention in your heart for the specific prayer (e.g. Fajr, Zuhr) and number of rak‘ahs." },
  { t: "Takbeer-e-Tahreema", d: "Raise both hands up to the ears (men) or shoulders (women) and say ‘Allahu Akbar’, then fold the hands below the chest." },
  { t: "Thana", d: "Recite: ‘Subhanaka Allahumma wa bihamdika, wa tabarakasmuka, wa ta‘ala jadduka, wa la ilaha ghairuk.’" },
  { t: "Ta‘awwuz & Tasmiyah", d: "Quietly say ‘A‘udhu billahi minash-shaitanir rajeem’ then ‘Bismillahir Rahmanir Raheem’." },
  { t: "Surah Al-Fatiha", d: "Recite Surah Al-Fatiha in full, ending with ‘Ameen’." },
  { t: "Additional Surah", d: "Recite another Surah or a few verses of the Qur’an (only in the first two rak‘ahs of Fard, and in every rak‘ah of Sunnah/Nafl)." },
  { t: "Ruku‘", d: "Say ‘Allahu Akbar’ and bow down, placing the hands on the knees. Recite ‘Subhana Rabbiyal Azeem’ three times." },
  { t: "Qawmah", d: "Rise from Ruku‘ saying ‘Sami‘ Allahu liman hamidah’, then standing: ‘Rabbana lakal hamd’." },
  { t: "Sajdah (First)", d: "Say ‘Allahu Akbar’ and go into prostration. Recite ‘Subhana Rabbiyal A‘la’ three times." },
  { t: "Jalsah", d: "Sit up briefly between the two prostrations, saying ‘Allahu Akbar’." },
  { t: "Sajdah (Second)", d: "Prostrate again with ‘Allahu Akbar’ and recite ‘Subhana Rabbiyal A‘la’ three times. This completes one rak‘ah." },
  { t: "Tashahhud", d: "After every two rak‘ahs, sit and recite At-Tahiyyat: ‘At-tahiyyatu lillahi was-salawatu wat-tayyibat…’" },
  { t: "Durood & Dua", d: "In the final sitting, recite Durood-e-Ibrahim followed by a dua such as ‘Rabbana atina fid-dunya hasanah…’" },
  { t: "Salam", d: "End the prayer by turning the face to the right saying ‘As-salamu alaikum wa rahmatullah’, then to the left with the same words." },
];

function NamazPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-16">
      <Link to="/techniques" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-3.5 w-3.5" /> Techniques
      </Link>

      <div className="mt-6 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent-2 shadow-glow">
          <Moon className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="font-display text-3xl text-foreground sm:text-4xl">Namaz ka Tareeka</h1>
          <p className="text-sm text-muted-foreground">The step-by-step method of Salah</p>
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
