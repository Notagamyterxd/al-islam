
## What we're building

A calm, focused web app inspired by Sabr — a place for short Islamic reminders & duas, plus a dedicated section of chill background music for studying. Midnight Focus aesthetic (deep navy + electric indigo), built to feel peaceful and distraction-free.

## Pages (separate routes)

- `/` — Landing: hero with calming intro, quick links into Reminders, Chill Music, and Pomodoro
- `/reminders` — Browse & play Islamic audio reminders and duas (cards with play buttons + a sticky bottom audio player)
- `/music` — Chill lofi/ambient tracks for studying, with the Pomodoro timer side-by-side
- `/favorites` — Saved audios (requires login)
- `/auth` — Sign in / sign up

## Key features

1. **Audio library** — placeholder demo audio URLs (free CC tracks) categorized: Quran recitations, duas, short reminders, lofi study, ambient, nature sounds. Each item has title, category, duration, cover gradient.
2. **Persistent player** — sticky bottom bar with play/pause, scrub, volume, track title. Stays mounted across route changes via root layout.
3. **Pomodoro timer** — 25/5 default, configurable, with start/pause/reset and session counter. Lives on `/music` so users can study + listen together.
4. **Favorites** — heart icon on each track; saved per user in Lovable Cloud.
5. **Auth** — email/password via Lovable Cloud (required only for favorites; everything else works logged out).

## Design direction

- **Palette**: `#0a0a1a` background, `#141432` surfaces, `#1e1e5a` elevated cards, `#4f46e5` electric indigo accent, soft white foreground. Subtle indigo glow on hover/active states.
- **Typography**: Instrument Serif for headings (calm, contemplative), Inter for body.
- **Mood**: Generous spacing, soft star/particle background on hero, gentle fade-in animations via framer-motion. No loud gradients — restrained, meditative.
- All colors as semantic tokens in `src/styles.css` (oklch).

## Technical notes

- TanStack Start file-based routes: `index.tsx`, `reminders.tsx`, `music.tsx`, `favorites.tsx`, `auth.tsx`. Each with own `head()` metadata.
- Persistent player implemented via a Zustand store + `<AudioPlayer />` rendered in `__root.tsx` (so it survives route changes).
- Lovable Cloud enabled for: auth + a `favorites` table (`user_id`, `audio_id`, `created_at`) with RLS so users only see their own.
- Audio data: a static `src/data/audios.ts` array of demo tracks (no DB needed for the catalog itself).
- framer-motion for animations; shadcn components for buttons, dialog, slider.

## Out of scope (for now)

- User-uploaded audio
- Playlists / queues beyond next/prev within a category
- Mobile native features
