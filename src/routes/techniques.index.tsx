import { createFileRoute, Link } from "@tanstack/react-router";
import { GraduationCap, Droplets, Moon, ChevronRight } from "lucide-react";

export const Route = createFileRoute("/techniques/")({
  head: () => ({
    meta: [
      { title: "Techniques — Namaz & Wuzu ka Tareeka" },
      {
        name: "description",
        content:
          "Step-by-step techniques for performing Wuzu (ablution) and Namaz (prayer) correctly according to the Sunnah.",
      },
    ],
  }),
  component: TechniquesIndex,
});

const items = [
  {
    to: "/techniques/wuzu" as const,
    title: "Wuzu ka Tareeka",
    subtitle: "The proper way of performing ablution",
    Icon: Droplets,
    hue: "from-sky-500 to-cyan-400",
  },
  {
    to: "/techniques/namaz" as const,
    title: "Namaz ka Tareeka",
    subtitle: "Step-by-step method of offering Salah",
    Icon: Moon,
    hue: "from-primary to-accent-2",
  },
];

function TechniquesIndex() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-16">
      <div className="text-center">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent-2 shadow-glow">
          <GraduationCap className="h-6 w-6 text-primary-foreground" />
        </div>
        <h1 className="font-display text-4xl text-foreground sm:text-6xl">Techniques</h1>
        <p className="mt-3 text-sm text-muted-foreground sm:text-base">
          Learn the correct method of Wuzu and Namaz
        </p>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {items.map(({ to, title, subtitle, Icon, hue }) => (
          <Link
            key={to}
            to={to}
            className="group flex items-center gap-4 rounded-2xl border border-border bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-glow"
          >
            <div className={`flex h-12 w-12 flex-none items-center justify-center rounded-xl bg-gradient-to-br ${hue} shadow-glow`}>
              <Icon className="h-5 w-5 text-primary-foreground" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="truncate font-display text-lg text-foreground">{title}</h2>
              <p className="truncate text-xs text-muted-foreground">{subtitle}</p>
            </div>
            <ChevronRight className="h-4 w-4 flex-none text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-foreground" />
          </Link>
        ))}
      </div>
    </div>
  );
}
