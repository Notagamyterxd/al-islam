import { Pause, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type Track = {
  id: string;
  title: string;
  artist: string;
  hue: number;
};

const tracks: Track[] = [
  { id: "h1", title: "Maula Ya Salli", artist: "Sami Yusuf", hue: 158 },
  { id: "h2", title: "Hasbi Rabbi", artist: "Sami Yusuf", hue: 42 },
  { id: "h9", title: "Chal Deen Ki Tabligh", artist: "Shaz Khan", hue: 150 },
  { id: "h10", title: "Mohabbat Ke Sajday", artist: "Shaz Khan", hue: 36 },
];

const BUCKET = "naat-audio";

function publicUrl(trackId: string, ext = "mp3") {
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(`${trackId}.${ext}`);
  return data.publicUrl;
}

function GeometricPattern({ hue }: { hue: number }) {
  const c1 = `oklch(0.55 0.12 ${hue})`;
  const c2 = `oklch(0.78 0.14 ${hue})`;
  return (
    <svg viewBox="0 0 120 120" className="absolute inset-0 h-full w-full" aria-hidden>
      <defs>
        <linearGradient id={`g-${hue}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={c1} />
          <stop offset="100%" stopColor={c2} />
        </linearGradient>
        <pattern id={`p-${hue}`} x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse">
          <path
            d="M15 0 L30 15 L15 30 L0 15 Z M15 6 L24 15 L15 24 L6 15 Z"
            fill="none"
            stroke={c2}
            strokeOpacity="0.55"
            strokeWidth="0.8"
          />
          <circle cx="15" cy="15" r="2" fill={c2} fillOpacity="0.5" />
        </pattern>
      </defs>
      <rect width="120" height="120" fill={`url(#g-${hue})`} />
      <rect width="120" height="120" fill={`url(#p-${hue})`} />
      <g transform="translate(60 60)" fill="none" stroke="white" strokeOpacity="0.85" strokeWidth="1.2">
        <polygon points="0,-26 7,-7 26,0 7,7 0,26 -7,7 -26,0 -7,-7" />
        <polygon points="0,-26 7,-7 26,0 7,7 0,26 -7,7 -26,0 -7,-7" transform="rotate(45)" />
        <circle r="6" />
      </g>
    </svg>
  );
}

function NaatCard({
  track,
  isPlaying,
  onTogglePlay,
  audioUrl,
}: {
  track: Track;
  isPlaying: boolean;
  onTogglePlay: (url: string) => void;
  audioUrl: string;
}) {
  return (
    <article className="group relative overflow-hidden rounded-2xl border border-border bg-card p-3 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-glow">
      <div className="relative aspect-square overflow-hidden rounded-xl">
        <GeometricPattern hue={track.hue} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent" />

        <button
          type="button"
          onClick={() => onTogglePlay(audioUrl)}
          aria-label={`${isPlaying ? "Pause" : "Play"} ${track.title}`}
          className="absolute bottom-2 right-2 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-glow transition-transform hover:scale-110 group-hover:scale-105"
        >
          {isPlaying ? (
            <Pause className="h-4 w-4" fill="currentColor" />
          ) : (
            <Play className="ml-0.5 h-4 w-4" fill="currentColor" />
          )}
        </button>
      </div>
      <div className="mt-3 px-1 pb-1">
        <h3 className="truncate text-sm font-medium text-foreground">{track.title}</h3>
        <p className="truncate text-xs text-muted-foreground">{track.artist}</p>
      </div>
    </article>
  );
}

export function HamdNaatSection({ hideHeader = false }: { hideHeader?: boolean } = {}) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playingId, setPlayingId] = useState<string | null>(null);

  const togglePlay = (track: Track, url: string) => {
    if (playingId === track.id) {
      audioRef.current?.pause();
      setPlayingId(null);
      return;
    }
    audioRef.current?.pause();
    const audio = new Audio(url);
    audioRef.current = audio;
    audio.onended = () => setPlayingId((p) => (p === track.id ? null : p));
    audio.onerror = () => {
      toast.error("Could not play this audio file");
      setPlayingId(null);
    };
    audio.play().catch(() => {
      toast.error("Playback failed");
      setPlayingId(null);
    });
    setPlayingId(track.id);
  };

  useEffect(() => {
    return () => {
      audioRef.current?.pause();
    };
  }, []);

  return (
    <section className="mx-auto mt-10 max-w-6xl px-0 sm:px-0">
      {!hideHeader && (
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-accent-2">Devotional</p>
            <h2 className="mt-1 font-display text-2xl text-foreground sm:text-3xl">
              Hamd &amp; Naat
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Praises of Allah and the Prophet ﷺ
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {tracks.map((t) => (
          <NaatCard
            key={t.id}
            track={t}
            isPlaying={playingId === t.id}
            audioUrl={`${publicUrl(t.id)}?v=2`}
            onTogglePlay={(u) => togglePlay(t, u)}
          />
        ))}
      </div>
    </section>
  );
}
