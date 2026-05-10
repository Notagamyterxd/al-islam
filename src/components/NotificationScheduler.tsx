import { useEffect, useRef } from "react";
import { useNotificationPrefs } from "@/hooks/use-notification-prefs";
import { PRAYERS, prayerTimeToDate, useTodayPrayerTimes } from "@/hooks/use-prayer-times";

/**
 * Mounts globally. While the app tab is open, fires browser notifications
 * for prayer times (with user-configured "minutes before") and a daily
 * Tasbih reminder at the chosen time.
 */
export function NotificationScheduler() {
  const { prefs, isAuthed } = useNotificationPrefs();
  const { data } = useTodayPrayerTimes();
  const firedRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!isAuthed) return;
    if (typeof window === "undefined" || !("Notification" in window)) return;
    if (Notification.permission !== "granted") return;

    const tick = () => {
      const now = Date.now();

      // Prayer reminders
      if (data) {
        for (const p of PRAYERS) {
          const cfg = prefs.prayers[p];
          if (!cfg?.enabled) continue;
          const target = prayerTimeToDate(data.date, data.timings[p]).getTime() - cfg.minutesBefore * 60_000;
          const key = `${data.date}-${p}-${cfg.minutesBefore}`;
          if (now >= target && now < target + 60_000 && !firedRef.current.has(key)) {
            firedRef.current.add(key);
            new Notification(`${p} prayer`, {
              body: cfg.minutesBefore === 0
                ? `It's time for ${p}.`
                : `${p} in ${cfg.minutesBefore} minutes (${data.timings[p]}).`,
              icon: "/favicon.ico",
            });
          }
        }
      }

      // Tasbih reminder
      if (prefs.tasbih.enabled) {
        const [h, m] = prefs.tasbih.time.split(":").map(Number);
        const d = new Date();
        const target = new Date(d.getFullYear(), d.getMonth(), d.getDate(), h, m, 0, 0).getTime();
        const dateStr = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
        const key = `tasbih-${dateStr}-${prefs.tasbih.time}`;
        if (now >= target && now < target + 60_000 && !firedRef.current.has(key)) {
          firedRef.current.add(key);
          new Notification("Time for Dhikr", {
            body: "Take a moment for Tasbih.",
            icon: "/favicon.ico",
          });
        }
      }
    };

    const interval = setInterval(tick, 30_000);
    tick();
    return () => clearInterval(interval);
  }, [prefs, data, isAuthed]);

  return null;
}
