# Deploying Al-Islam to Vercel

This app is a **TanStack Start** project (React 19 + Vite 7) with a Supabase backend. You can download the source from Lovable and host it anywhere that runs Node.js / Edge functions — including **Vercel**.

---

## 1. Export the code from Lovable

1. In Lovable, click **GitHub → Connect to GitHub** and push the repo to your own GitHub account.
   *(Or use **Download ZIP** from the project menu and push it to a new repo manually.)*
2. Clone it locally:
   ```bash
   git clone https://github.com/<you>/<repo>.git
   cd <repo>
   bun install   # or: npm install
   ```

---

## 2. Create your own Supabase project (free)

1. Go to <https://supabase.com> → **New project**.
2. Once it's ready, open **Project Settings → API** and copy:
   - `Project URL`
   - `anon` / `publishable` key
   - `service_role` key (secret — server only)
3. Open **SQL Editor** and run **every file** inside `supabase/migrations/` in order (oldest first). This recreates all tables, RLS policies, and functions.
4. Open **Storage** and create a **public** bucket named `naat-audio`. Upload your Hamd & Naat MP3s into it (keep the same filenames the code references).
5. Open **Authentication → Providers** and enable **Email** (and **Google** if you want social login).

---

## 3. Switch the build target to Vercel

The Lovable preview builds for Cloudflare Workers. The repo already ships with the Vercel-ready files — you just need to swap them in once:

1. Delete `wrangler.jsonc` (Cloudflare-only).
2. Delete `vite.config.ts` and **rename `vite.config.vercel.ts` → `vite.config.ts`**.
3. In `package.json`, remove these two Cloudflare-only deps:
   - `@cloudflare/vite-plugin`
   - `@lovable.dev/vite-tanstack-config`
4. Reinstall:
   ```bash
   bun install
   ```
5. `vercel.json` is already in the repo with the correct build/output settings — leave it as is.



---

## 4. Push to Vercel

1. Go to <https://vercel.com> → **Add New → Project** → import your GitHub repo.
2. Framework preset: **Other** (Vercel auto-detects Vite).
3. **Build command:** `bun run build` (or `npm run build`)
   **Output directory:** leave default — TanStack Start writes to `.vercel/output`.
4. Under **Environment Variables**, add:

   | Name | Value |
   |------|-------|
   | `VITE_SUPABASE_URL` | your Supabase Project URL |
   | `VITE_SUPABASE_PUBLISHABLE_KEY` | the `anon` key |
   | `VITE_SUPABASE_PROJECT_ID` | your project ref (e.g. `abcd1234`) |
   | `SUPABASE_URL` | same as above |
   | `SUPABASE_PUBLISHABLE_KEY` | same `anon` key |
   | `SUPABASE_SERVICE_ROLE_KEY` | the `service_role` key (mark as **Secret**) |
   | `LOVABLE_API_KEY` | *(optional — only for Deen Buddy AI chat. See step 5.)* |

5. Click **Deploy**. Vercel will build, and your site will be live at `https://<your-project>.vercel.app`.

---

## 5. (Optional) Deen Buddy AI chat

The AI chat uses the Lovable AI Gateway. On your own hosting you have two choices:

- **Easiest:** Sign up at <https://openrouter.ai> or <https://ai.google.dev>, get an API key, and replace `src/lib/ai-gateway.ts` with the OpenAI / Gemini SDK directly. Set the key as `OPENAI_API_KEY` (or similar) in Vercel env vars.
- **Skip it:** Delete `src/routes/deen-buddy.*` and the **Deen Buddy** link in `src/components/Header.tsx`. Everything else (audio, prayer times, tasbih, favorites) works without an AI key.

---

## 6. Custom domain

In Vercel → **Settings → Domains** → add your domain and follow the DNS instructions. Done.

---

## Files that matter

- `supabase/migrations/*.sql` — your full database schema. Run these on the new Supabase project.
- `.env.example` — copy to `.env` for local development.
- `package.json` → `scripts.dev` runs the dev server, `scripts.build` builds for production.

That's it — download, set 6 env vars, push to Vercel, and the site is live on your own infrastructure.
