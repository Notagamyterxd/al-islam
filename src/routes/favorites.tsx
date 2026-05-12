import { createFileRoute, Link } from "@tanstack/react-router";
import { useFavorites } from "@/hooks/use-favorites";
import { surahs } from "@/data/surahs";
import { SurahRow } from "@/components/SurahRow";
import { Heart } from "lucide-react";

export const Route = createFileRoute("/favorites")({
  head: () => ({
    meta: [
      { title: "Your Favorite Surahs — Al-Islam Audio Player" },
      { name: "description", content: "Surahs you've saved to come back to." },
      { property: "og:title", content: "Your Favorite Surahs" },
      { property: "og:description", content: "Saved Surahs from the Holy Quran." },
    ],
  }),
  component: FavoritesPage,
});

function FavoritesPage() {
  const { ids, isAuthed } = useFavorites();
  const list = surahs.filter((s) => ids.has(String(s.id)));

  if (!isAuthed) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-6 text-center">
        <Heart className="h-10 w-10 text-primary" />
        <h1 className="mt-6 font-display text-4xl">Sign in to save favorites</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Create a free account to keep your favorite Surahs in one place.
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
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-16">
      <h1 className="font-display text-4xl text-foreground sm:text-5xl">Your favorites</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        {list.length} saved {list.length === 1 ? "Surah" : "Surahs"}
      </p>

      {list.length === 0 ? (
        <p className="mt-12 text-sm text-muted-foreground">
          No favorites yet — tap the heart on any Surah to save it here.
        </p>
      ) : (
        <div className="mt-8 flex flex-col gap-2">
          {list.map((s, i) => (
            <SurahRow key={s.id} surah={s} queue={list} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
