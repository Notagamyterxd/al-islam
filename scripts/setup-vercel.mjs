#!/usr/bin/env node
/**
 * One-shot script to convert this Lovable export into a Vercel-ready repo.
 *
 * Usage (after cloning / unzipping the project locally):
 *   node scripts/setup-vercel.mjs
 *   bun install   # or: npm install
 *   git add -A && git commit -m "Prepare for Vercel"
 *   # then push to GitHub and import in Vercel
 *
 * What it does:
 *   1. Deletes wrangler.jsonc            (Cloudflare-only)
 *   2. Replaces vite.config.ts with the Vercel-targeted config
 *   3. Removes @cloudflare/vite-plugin and @lovable.dev/vite-tanstack-config from package.json
 *   4. Leaves vercel.json and .env.example in place (already correct)
 *
 * Safe to re-run. Do NOT run this inside the Lovable editor — it will break the preview.
 */
import { existsSync, readFileSync, writeFileSync, rmSync, renameSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const p = (rel) => resolve(root, rel);
const log = (msg) => console.log(`  • ${msg}`);

console.log("\n🔧 Preparing project for Vercel deployment...\n");

// 1. Delete wrangler.jsonc
if (existsSync(p("wrangler.jsonc"))) {
  rmSync(p("wrangler.jsonc"));
  log("Deleted wrangler.jsonc");
} else {
  log("wrangler.jsonc already removed");
}

// 2. Swap vite.config.ts -> vercel version
if (existsSync(p("vite.config.vercel.ts"))) {
  if (existsSync(p("vite.config.ts"))) rmSync(p("vite.config.ts"));
  renameSync(p("vite.config.vercel.ts"), p("vite.config.ts"));
  log("Replaced vite.config.ts with the Vercel-targeted config");
} else {
  log("vite.config.vercel.ts not found — assuming vite.config.ts is already Vercel-ready");
}

// 3. Clean package.json
const pkgPath = p("package.json");
const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));
const cloudflareDeps = ["@cloudflare/vite-plugin"];
const lovableDeps = ["@lovable.dev/vite-tanstack-config", "@lovable.dev/cloud-auth-js"];
let removed = 0;
for (const section of ["dependencies", "devDependencies"]) {
  if (!pkg[section]) continue;
  for (const dep of [...cloudflareDeps, ...lovableDeps]) {
    if (pkg[section][dep]) {
      delete pkg[section][dep];
      log(`Removed ${dep}`);
      removed++;
    }
  }
}
if (removed === 0) log("No Lovable/Cloudflare-only deps to remove");

// Ensure Vercel-required deps are present (they usually already are)
const required = {
  "@tanstack/react-start": pkg.dependencies?.["@tanstack/react-start"] ?? "^1.167.50",
  vite: pkg.devDependencies?.vite ?? "^7.3.1",
  "@vitejs/plugin-react": pkg.devDependencies?.["@vitejs/plugin-react"] ?? "^5.0.4",
  "@tailwindcss/vite": pkg.dependencies?.["@tailwindcss/vite"] ?? "^4.2.1",
  "vite-tsconfig-paths": pkg.dependencies?.["vite-tsconfig-paths"] ?? "^6.0.2",
};
pkg.dependencies ??= {};
pkg.devDependencies ??= {};
for (const [name, ver] of Object.entries(required)) {
  if (!pkg.dependencies[name] && !pkg.devDependencies[name]) {
    pkg.dependencies[name] = ver;
    log(`Added missing dep ${name}@${ver}`);
  }
}

writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n");
log("Updated package.json");

console.log(`
✅ Done!

Next steps:
   1.  bun install         (or: npm install)
   2.  cp .env.example .env    and fill in your Supabase keys
   3.  git add -A && git commit -m "Prepare for Vercel"
   4.  Push to GitHub, then import in Vercel and set the env vars
       listed in DEPLOYMENT.md (step 4).
`);
