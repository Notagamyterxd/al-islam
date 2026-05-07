import { Play, Pause, Heart } from "lucide-react";
import { motion } from "framer-motion";
import { usePlayer } from "@/stores/player";
import { useFavorites } from "@/hooks/use-favorites";
import type { AudioTrack } from "@/data/audios";
import { toast } from "sonner";

interface Props {
  track: AudioTrack;
  queue: AudioTrack[];
  index: number;
}

export function AudioCard({ track, queue, index }: Props) {
  const { current, isPlaying, play, toggle } = usePlayer();
  const { ids, toggle: toggleFav, isAuthed } = useFavorites();
  const isCurrent = current?.id === track.id;
  const playing = isCurrent && isPlaying;
  const isFav = ids.has(track.id);

  const onPlay = () => {
    if (isCurrent) toggle();
    else play(track, queue);
  };

  const onFav = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAuthed) {
      toast("Sign in to save favorites");
      return;
    }
    await toggleFav(track.id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.4 }}
      className="group relative overflow-hidden rounded-2xl border border-border bg-card p-4 transition-all hover:border-primary/40 hover:shadow-glow"
    >
      <button onClick={onPlay} className="block w-full text-left">
        <div
          className={`relative aspect-square w-full overflow-hidden rounded-xl bg-gradient-to-br ${track.gradient}`}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-glow">
              {playing ? <Pause className="h-5 w-5" /> : <Play className="ml-0.5 h-5 w-5" />}
            </div>
          </div>
          {playing && (
            <div className="absolute bottom-2 left-2 flex items-end gap-0.5">
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  className="block w-1 rounded-full bg-white"
                  animate={{ height: ["6px", "14px", "6px"] }}
                  transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
                />
              ))}
            </div>
          )}
        </div>
        <div className="mt-3 flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="truncate text-sm font-medium text-foreground">{track.title}</h3>
            <p className="truncate text-xs text-muted-foreground">{track.author}</p>
          </div>
          <span className="flex-none text-xs text-muted-foreground">{track.duration}</span>
        </div>
      </button>
      <button
        onClick={onFav}
        className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/40 backdrop-blur transition-all hover:bg-black/60"
        aria-label="Favorite"
      >
        <Heart
          className={`h-4 w-4 transition-colors ${isFav ? "fill-primary text-primary" : "text-white"}`}
        />
      </button>
    </motion.div>
  );
}
