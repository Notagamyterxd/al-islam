import { PRAYERS, type PrayerName } from "@/hooks/use-prayer-times";
import type { PrayerLog } from "@/hooks/use-prayer-logs";

interface Props {
  logs: PrayerLog[];
}

export function MonthlyPrayerCalendar({ logs }: Props) {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();
  const monthName = today.toLocaleString("default", { month: "long" });

  const byDate = new Map<string, Set<PrayerName>>();
  for (const l of logs) {
    if (!byDate.has(l.prayer_date)) byDate.set(l.prayer_date, new Set());
    byDate.get(l.prayer_date)!.add(l.prayer_name);
  }

  const cells: Array<{ day: number | null; key: string }> = [];
  for (let i = 0; i < firstDay; i++) cells.push({ day: null, key: `e${i}` });
  for (let d = 1; d <= daysInMonth; d++) cells.push({ day: d, key: `d${d}` });

  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-display text-xl text-foreground">{monthName} {year}</h3>
        <p className="text-xs text-muted-foreground">{logs.length} prayers logged</p>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-[10px] text-muted-foreground">
        {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
          <div key={i} className="py-1">{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {cells.map((c) => {
          if (c.day === null) return <div key={c.key} />;
          const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(c.day).padStart(2, "0")}`;
          const completed = byDate.get(dateStr) ?? new Set();
          const isToday = c.day === today.getDate();
          return (
            <div
              key={c.key}
              className={`flex flex-col items-center gap-1 rounded-lg p-1.5 ${
                isToday ? "bg-accent/20 ring-1 ring-accent-2/50" : "hover:bg-muted/30"
              }`}
            >
              <span className="text-[11px] text-foreground">{c.day}</span>
              <div className="flex gap-0.5">
                {PRAYERS.map((p) => (
                  <span
                    key={p}
                    title={p}
                    className={`h-1.5 w-1.5 rounded-full ${
                      completed.has(p) ? "bg-primary" : "bg-muted"
                    }`}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex items-center justify-center gap-4 text-[11px] text-muted-foreground">
        <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-primary" /> Prayed</span>
        <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-muted" /> Missed</span>
      </div>
    </div>
  );
}
