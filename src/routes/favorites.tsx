import { createFileRoute, Link } from "@tanstack/react-router";
import { useFavorites } from "@/hooks/use-favorites";
import { audios } from "@/data/audios";
import { AudioCard } from "@/components/AudioCard";
import { Heart } from "lucide-react";

export const Route = createFileRoute("/favorites")({
  head: () => ({
    meta: [
      { title: "Your Favorites — Sukoon" },
      { name: "description", content: "Audios you've saved to come back to." },
      { property: "og:title", content: "Your Favorites — Sukoon" },
      { property: "og:description", content: "Saved audios." },
    ],
  }),
  component: FavoritesPage,
});

function FavoritesPage() {
  const { ids, isAuthed } = useFavorites();
  const list = audios.filter((a) => ids.has(a.id));

  if (!isAuthed) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-6 text-center">
        <Heart className="h-10 w-10 text-primary" />
        <h1 className="mt-6 font-display text-4xl">Sign in to save favorites</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Create a free account to keep your favorite reminders and tracks in one place.
        </p>
        <Link
          to="/auth"
          className="mt-8 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-glow"
        >
          Sign in
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
      <h1 className="font-display text-5xl text-foreground md:text-6xl">Your favorites</h1>
      <p className="mt-3 text-muted-foreground">{list.length} saved {list.length === 1 ? "audio" : "audios"}.</p>

      {list.length === 0 ? (
        <p className="mt-12 text-sm text-muted-foreground">
          No favorites yet — tap the heart on any audio to save it here.
        </p>
      ) : (
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {list.map((t, i) => (
            <AudioCard key={t.id} track={t} queue={list} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
