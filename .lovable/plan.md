# Plan: Namaz Tracker, Tasbih Counter & Notifications

Adds three new sections to the Al-Quran app, accessible via the header navigation.

## 1. Prayer Times & Tracker (`/namaz`)

- Fetch prayer times from the free **Aladhan API** (`https://api.aladhan.com/v1/timingsByCity`) for **Neuss, Germany**. (Muslim Pro has no public API; Aladhan is the standard free, accurate alternative — same data source most Islamic apps use.)
- Display Fajr, Dhuhr, Asr, Maghrib, Isha with times and a "next prayer" countdown.
- Each prayer has a "Mark as prayed" button — disabled (with lock icon + tooltip) until the prayer's scheduled time has passed.
- Persist completions per user/date in a new `prayer_logs` table (one row per user/date/prayer).
- Monthly calendar grid showing 5 dots per day (one per prayer) — green = completed, gray = missed, blue = upcoming. Hover/tap shows details.

## 2. Tasbih Counter (`/tasbih`)

- Large tap target: counter increments on click. Big haptic-feel button.
- Counter resets to 0 after 100 → rounds++. Display current count, rounds today, total rounds this month.
- Reset button + dhikr selector (SubhanAllah / Alhamdulillah / Allahu Akbar) to label sessions.
- Persist sessions in `tasbih_sessions` table (user_id, dhikr, count, rounds, date).

## 3. Notifications (`/settings/notifications`)

- Browser Push API with `Notification.requestPermission()`.
- Per-prayer toggle + "minutes before" selector (0/5/10/15).
- Tasbih reminder: toggle + frequency (daily at chosen time, or every X hours).
- Stored in `notification_prefs` table (user_id, settings json).
- A client-side scheduler (in a root-level provider using `setTimeout`) compares prayer times to current time and fires `new Notification(...)`. Runs while the tab is open. (True push requires a service worker + VAPID infra — out of scope for the browser-only "reliable" requirement; we'll note this clearly in the UI.)

## Database (one migration)

- `prayer_logs` (user_id, prayer_date, prayer_name, completed_at) — RLS: own rows.
- `tasbih_sessions` (user_id, dhikr, count, rounds, session_date) — RLS: own rows.
- `notification_prefs` (user_id PK, prefs jsonb) — RLS: own row.

## Header / Nav

Update `Header.tsx` to include: Surahs · Namaz · Tasbih · Favorites · Settings.

## Files

- New: `src/routes/namaz.tsx`, `src/routes/tasbih.tsx`, `src/routes/settings.notifications.tsx`
- New: `src/components/PrayerCard.tsx`, `src/components/MonthlyPrayerCalendar.tsx`, `src/components/TasbihCounter.tsx`, `src/components/NotificationScheduler.tsx`
- New: `src/hooks/use-prayer-times.ts`, `src/hooks/use-prayer-logs.ts`, `src/hooks/use-tasbih.ts`, `src/hooks/use-notification-prefs.ts`
- Modified: `src/components/Header.tsx`, `src/routes/__root.tsx` (mount NotificationScheduler)
- Migration: 3 new tables with RLS

## Notes for the user

- Prayer times come from Aladhan (free, no key needed) — Muslim Pro doesn't expose a public API.
- Notifications fire only while the app tab is open (browser limitation without a backend push service).
- Login required to track prayers/tasbih (same auth as Favorites).
