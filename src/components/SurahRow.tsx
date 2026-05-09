import { Play, Pause, Heart, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { usePlayer } from "@/stores/player";
import { useFavorites } from "@/hooks/use-favorites";
import type { Surah } from "@/data/surahs";
import { toast } from "sonner";

interface Props {
  surah: Surah;
  queue: Surah[];
  index: number;
}

export function SurahRow({ surah, queue, index }: Props) {
  const { current, isPlaying, play, toggle } = usePlayer();
  const { ids, toggle: toggleFav, isAuthed } = useFavorites();
  const isCurrent = current?.id === surah.id;
  const playing = isCurrent && isPlaying;
  const isFav = ids.has(String(surah.id));

  const onPlay = () => {
    if (isCurrent) toggle();
    else play(surah, queue);
  };

  const onFav = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAuthed) {
      toast("Sign in to save favorites");
      return;
    }
    await toggleFav(String(surah.id));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.01, 0.3), duration: 0.25 }}
      className={`group flex items-center gap-3 rounded-xl border p-3 transition-all sm:gap-4 sm:p-4 ${
        isCurrent
          ? "border-primary/50 bg-card shadow-glow"
          : "border-border/60 bg-card/40 hover:border-primary/30 hover:bg-card"
      }`}
    >
      <button
        onClick={onPlay}
        className="relative flex h-11 w-11 flex-none items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-accent-2/20 text-primary transition-all hover:from-primary hover:to-accent-2 hover:text-primary-foreground sm:h-12 sm:w-12"
        aria-label={playing ? "Pause" : "Play"}
      >
        {playing ? (
          <Pause className="h-4 w-4" />
        ) : (
          <Play className="ml-0.5 h-4 w-4" />
        )}
      </button>

      <button onClick={onPlay} className="min-w-0 flex-1 text-left">
        <div className="flex items-baseline gap-2">
          <span className="text-xs tabular-nums text-muted-foreground">{surah.id}.</span>
          <h3 className="truncate text-sm font-medium text-foreground sm:text-base">{surah.name}</h3>
        </div>
        <div className="mt-0.5 flex items-center gap-2 text-[11px] text-muted-foreground sm:text-xs">
          <span className="truncate">{surah.translated}</span>
          <span className="opacity-50">·</span>
          <span className="inline-flex items-center gap-1 capitalize">
            <MapPin className="h-3 w-3" /> {surah.place}
          </span>
          <span className="opacity-50">·</span>
          <span>{surah.verses} ayahs</span>
        </div>
      </button>

      <span
        className="hidden flex-none font-arabic text-xl text-foreground/90 sm:block sm:text-2xl"
        dir="rtl"
        lang="ar"
      >
        {surah.arabic}
      </span>

      <button
        onClick={onFav}
        className="flex h-9 w-9 flex-none items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        aria-label="Favorite"
      >
        <Heart className={`h-4 w-4 transition-colors ${isFav ? "fill-primary text-primary" : ""}`} />
      </button>
    </motion.div>
  );
}
