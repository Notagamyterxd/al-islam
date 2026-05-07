import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Headphones, Music, Timer, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sukoon — A calm space to listen and focus" },
      { name: "description", content: "Islamic reminders, duas and chill study music. Find peace, then get to work." },
      { property: "og:title", content: "Sukoon — A calm space to listen and focus" },
      { property: "og:description", content: "Islamic reminders, duas and chill study music." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-stars">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/40 to-background" />
        <div className="relative mx-auto max-w-5xl px-6 pb-24 pt-24 text-center md:pt-36">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-xs text-muted-foreground backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-primary shadow-glow" />
              Quiet your heart. Focus your mind.
            </span>
            <h1 className="mt-8 font-display text-5xl leading-[1.05] text-foreground md:text-7xl lg:text-8xl">
              Reminders for the soul,<br />
              <span className="italic text-primary">music for the work.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-base text-muted-foreground md:text-lg">
              A calm space to listen to short Islamic reminders and duas — then settle in with chill
              study music while you tackle your homework.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/reminders"
                className="group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-glow transition-transform hover:scale-105"
              >
                Listen to reminders
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                to="/music"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-6 py-3 text-sm text-foreground backdrop-blur transition-colors hover:bg-card"
              >
                Study with music
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Three pillars */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              icon: Headphones,
              title: "Reminders & Duas",
              text: "Short audios to ground you — Quran recitations, morning and evening duas.",
              to: "/reminders" as const,
            },
            {
              icon: Music,
              title: "Chill Study Music",
              text: "Lofi, ambient and rain — soft soundscapes to help you concentrate.",
              to: "/music" as const,
            },
            {
              icon: Timer,
              title: "Pomodoro Timer",
              text: "25 minutes of focus, 5 minutes of rest. Repeat until the work is done.",
              to: "/music" as const,
            },
          ].map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            >
              <Link
                to={p.to}
                className="group block h-full rounded-3xl border border-border bg-card p-8 transition-all hover:border-primary/40 hover:shadow-glow"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-accent-2/20 text-primary">
                  <p.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-6 text-2xl text-foreground">{p.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{p.text}</p>
                <span className="mt-6 inline-flex items-center gap-1 text-xs text-primary">
                  Open <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
