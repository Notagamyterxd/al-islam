import { createFileRoute, Link } from "@tanstack/react-router";
import { Bell, BellOff } from "lucide-react";
import { useState, useEffect } from "react";
import { useNotificationPrefs, DEFAULT_PREFS } from "@/hooks/use-notification-prefs";
import { PRAYERS } from "@/hooks/use-prayer-times";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/settings/notifications")({
  head: () => ({
    meta: [
      { title: "Notification Settings — Prayer & Tasbih Reminders" },
      { name: "description", content: "Customize browser notifications for prayer times and Tasbih reminders." },
    ],
  }),
  component: NotifPage,
});

function NotifPage() {
  const { user } = useAuth();
  const { prefs, save, loaded } = useNotificationPrefs();
  const [permission, setPermission] = useState<NotificationPermission>("default");

  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = async () => {
    if (typeof window === "undefined" || !("Notification" in window)) return;
    const p = await Notification.requestPermission();
    setPermission(p);
  };

  if (!user) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <Bell className="mx-auto h-10 w-10 text-muted-foreground" />
        <h1 className="mt-4 font-display text-3xl">Sign in for reminders</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          <Link to="/auth" className="text-primary underline">Sign in</Link> to save notification preferences.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 sm:py-16">
      <div className="text-center">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent-2 shadow-glow">
          <Bell className="h-6 w-6 text-primary-foreground" />
        </div>
        <h1 className="font-display text-4xl text-foreground sm:text-5xl">Notifications</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Reminders fire while the app tab is open in your browser.
        </p>
      </div>

      <div className={`mt-6 rounded-2xl border p-4 ${permission === "granted" ? "border-primary/40 bg-primary/10" : "border-border bg-card"}`}>
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-foreground">
              Browser permission: <span className="text-primary">{permission}</span>
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {permission === "granted"
                ? "You'll receive reminders while this tab is open."
                : "Allow notifications to receive reminders."}
            </p>
          </div>
          {permission !== "granted" && (
            <button
              onClick={requestPermission}
              className="rounded-full bg-primary px-4 py-2 text-xs font-medium text-primary-foreground shadow-glow"
            >
              Enable
            </button>
          )}
        </div>
      </div>

      {!loaded ? (
        <p className="mt-8 text-center text-sm text-muted-foreground">Loading…</p>
      ) : (
        <>
          <Section title="Prayer reminders">
            {PRAYERS.map((p) => {
              const cfg = prefs.prayers[p] ?? DEFAULT_PREFS.prayers[p];
              return (
                <div key={p} className="flex items-center justify-between rounded-2xl border border-border bg-card p-4">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() =>
                        save({ ...prefs, prayers: { ...prefs.prayers, [p]: { ...cfg, enabled: !cfg.enabled } } })
                      }
                      className={`flex h-6 w-11 items-center rounded-full transition-colors ${
                        cfg.enabled ? "bg-primary" : "bg-muted"
                      }`}
                    >
                      <span
                        className={`h-5 w-5 rounded-full bg-background transition-transform ${
                          cfg.enabled ? "translate-x-5" : "translate-x-0.5"
                        }`}
                      />
                    </button>
                    <span className="font-display text-lg text-foreground">{p}</span>
                  </div>
                  <select
                    value={cfg.minutesBefore}
                    onChange={(e) =>
                      save({
                        ...prefs,
                        prayers: { ...prefs.prayers, [p]: { ...cfg, minutesBefore: Number(e.target.value) } },
                      })
                    }
                    className="rounded-full border border-border bg-card px-3 py-1.5 text-xs text-foreground"
                  >
                    {[0, 5, 10, 15, 30].map((m) => (
                      <option key={m} value={m}>{m === 0 ? "On time" : `${m} min before`}</option>
                    ))}
                  </select>
                </div>
              );
            })}
          </Section>

          <Section title="Tasbih reminder">
            <div className="flex items-center justify-between rounded-2xl border border-border bg-card p-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => save({ ...prefs, tasbih: { ...prefs.tasbih, enabled: !prefs.tasbih.enabled } })}
                  className={`flex h-6 w-11 items-center rounded-full transition-colors ${
                    prefs.tasbih.enabled ? "bg-primary" : "bg-muted"
                  }`}
                >
                  <span
                    className={`h-5 w-5 rounded-full bg-background transition-transform ${
                      prefs.tasbih.enabled ? "translate-x-5" : "translate-x-0.5"
                    }`}
                  />
                </button>
                <span className="font-display text-lg text-foreground">Daily Dhikr</span>
              </div>
              <input
                type="time"
                value={prefs.tasbih.time}
                onChange={(e) => save({ ...prefs, tasbih: { ...prefs.tasbih, time: e.target.value } })}
                className="rounded-full border border-border bg-card px-3 py-1.5 text-xs text-foreground"
              />
            </div>
          </Section>

          <p className="mt-6 flex items-start gap-2 rounded-xl border border-border/50 bg-muted/20 p-3 text-xs text-muted-foreground">
            <BellOff className="h-3.5 w-3.5 flex-none translate-y-0.5" />
            Note: notifications only fire while this tab is open. True background push requires installing the app.
          </p>
        </>
      )}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-8">
      <h2 className="mb-3 px-1 text-xs uppercase tracking-wider text-muted-foreground">{title}</h2>
      <div className="flex flex-col gap-2">{children}</div>
    </div>
  );
}
