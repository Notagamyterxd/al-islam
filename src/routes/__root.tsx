import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";
import { Header } from "@/components/Header";
import { AudioPlayer } from "@/components/AudioPlayer";
import { TranscriptPanel } from "@/components/TranscriptPanel";
import { NotificationScheduler } from "@/components/NotificationScheduler";
import { Toaster } from "@/components/ui/sonner";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background bg-stars px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-7xl text-foreground">404</h1>
        <p className="mt-2 text-sm text-muted-foreground">This page drifted into the night.</p>
        <div className="mt-6">
          <Link to="/" className="inline-flex rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground shadow-glow">
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-3xl">Something broke</h1>
        <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
        <button
          onClick={() => { router.invalidate(); reset(); }}
          className="mt-6 rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground shadow-glow"
        >
          Try again
        </button>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Al-Quran Audio Player — All 114 Surahs" },
      { name: "description", content: "Stream high-quality recitations of all 114 Surahs of the Holy Quran. A clean, ad-free listening experience." },
      { property: "og:title", content: "Al-Quran Audio Player" },
      { name: "twitter:title", content: "Al-Quran Audio Player" },
      { property: "og:description", content: "Stream all 114 Surahs of the Holy Quran with high-quality recitations." },
      { name: "twitter:description", content: "Stream all 114 Surahs of the Holy Quran with high-quality recitations." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/b5bfedb6-4c61-4d4f-aa64-f9fc69819519/id-preview-a5b9613e--33c369ed-e605-4957-a2c3-239c4874c29c.lovable.app-1778176208870.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/b5bfedb6-4c61-4d4f-aa64-f9fc69819519/id-preview-a5b9613e--33c369ed-e605-4957-a2c3-239c4874c29c.lovable.app-1778176208870.png" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head><HeadContent /></head>
      <body>{children}<Scripts /></body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 pb-32">
          <Outlet />
        </main>
        <TranscriptPanel />
        <AudioPlayer />
        <NotificationScheduler />
        <Toaster />
      </div>
    </QueryClientProvider>
  );
}
