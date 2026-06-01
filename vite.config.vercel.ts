// Vercel-targeted Vite config.
//
// HOW TO USE (after exporting the project to GitHub / a zip):
//   1. Delete `vite.config.ts`
//   2. Rename this file to `vite.config.ts`
//   3. Delete `wrangler.jsonc` (Cloudflare-only)
//   4. Remove these Cloudflare-only deps from package.json:
//        "@cloudflare/vite-plugin"
//        "@lovable.dev/vite-tanstack-config"
//   5. Add these deps (already in your lockfile, just make sure they stay):
//        "@tanstack/react-start", "vite", "@vitejs/plugin-react",
//        "@tailwindcss/vite", "vite-tsconfig-paths"
//   6. `bun install`
//   7. Push to GitHub → import to Vercel → set the env vars from .env.example
//
// Do NOT use this file inside Lovable — the in-editor preview needs
// `@lovable.dev/vite-tanstack-config`. This file is only for self-hosting.

import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsConfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    tsConfigPaths(),
    tailwindcss(),
    tanstackStart({
      target: "vercel",
      customViteReactPlugin: true,
      server: { entry: "server" },
    }),
    viteReact(),
  ],
});
