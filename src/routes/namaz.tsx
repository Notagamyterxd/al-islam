import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Moon, MapPin } from "lucide-react";
import {
  PRAYERS,
  prayerTimeToDate,
  todayLocalISO,
  useTodayPrayerTimes,
  type PrayerName,
} from "@/hooks/use-prayer-times";
import { usePrayerLogs } from "@/hooks/use-prayer-logs";
import { PrayerCard } from "@/components/PrayerCard";
import { MonthlyPrayerCalendar } from "@/components/MonthlyPrayerCalendar";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/namaz")({
  head: () => ({
    meta: [
      { title: "Namaz Tracker — Prayer Times for Neuss, Germany" },
      { name: "description", content: "Track your five daily prayers with accurate times for Neuss, Germany. Monthly overview and progress tracking." },
    ],
  }),
  component: NamazPage,
});

function NamazPage() {
  const { user } = useAuth();
  const { data, isLoading, error } = useTodayPrayerTimes();
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(t);
  }, []);

  const today = todayLocalISO();
  const monthStart = today.slice(0, 8) + "01";
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const monthEnd = today.slice(0, 8) + String(lastDay).padStart(2, "0");
  const { logs, togglePrayer } = usePrayerLogs(monthStart, monthEnd);

  const completedToday = useMemo(() => {
    const set = new Set<PrayerName>();
    logs.forEach((l) => l.prayer_date === today && set.add(l.prayer_name));
    return set;
  }, [logs, today]);

  const nextPrayer = useMemo<PrayerName | null>(() => {
    if (!data) return null;
    for (const p of PRAYERS) {
      if (prayerTimeToDate(data.date, data.timings[p]).getTime() > now.getTime()) return p;
    }
    return null;
  }, [data, now]);

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-16">
      <div className="text-center">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent-2 shadow-glow">
          <Moon className="h-6 w-6 text-primary-foreground" />
        </div>
        <h1 className="font-display text-4xl text-foreground sm:text-6xl">Namaz Tracker</h1>
        <p className="mt-3 inline-flex items-center gap-1.5 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" /> Neuss, Germany
          {data && <span className="ml-2">· {data.hijri}</span>}
        </p>
      </div>

      {!user && (
        <div className="mt-8 rounded-2xl border border-border bg-card p-4 text-center text-sm text-muted-foreground">
          <Link to="/auth" className="text-primary underline">Sign in</Link> to track your prayers and see your monthly progress.
        </div>
      )}

      {isLoading && <p className="mt-8 text-center text-sm text-muted-foreground">Loading prayer times…</p>}
      {error && <p className="mt-8 text-center text-sm text-destructive">Failed to load prayer times.</p>}

      {data && (
        <>
          <div className="mt-8 flex flex-col gap-3">
            {PRAYERS.map((p) => {
              const time = data.timings[p];
              const dt = prayerTimeToDate(data.date, time);
              const isPast = dt.getTime() <= now.getTime();
              const isNext = nextPrayer === p;
              const isCompleted = completedToday.has(p);
              return (
                <PrayerCard
                  key={p}
                  name={p}
                  time={time}
                  isPast={isPast}
                  isNext={isNext}
                  isCompleted={isCompleted}
                  disabled={!user}
                  onToggle={() => togglePrayer(today, p)}
                />
              );
            })}
          </div>

          <div className="mt-10">
            <MonthlyPrayerCalendar logs={logs} />
          </div>
        </>
      )}
    </div>
  );
}
