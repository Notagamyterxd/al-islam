import { Pause, Play, Upload, Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
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
  { id: "h3", title: "Tala'al Badru Alayna", artist: "Mesut Kurtis", hue: 168 },
  { id: "h4", title: "Qaseeda Burda Shareef", artist: "Mehmood ul Hassan", hue: 38 },
  { id: "h5", title: "Ya Nabi Salam Alayka", artist: "Maher Zain", hue: 152 },
  { id: "h6", title: "Faslun Min Al-Madeeh", artist: "Mishary Alafasy", hue: 46 },
  { id: "h7", title: "Allahu Allahu", artist: "Sami Yusuf", hue: 162 },
  { id: "h8", title: "Mustafa Jaan-e-Rehmat", artist: "Owais Raza Qadri", hue: 40 },
  { id: "h9", title: "Chal Deen Ki Tabligh (Urdu Version)", artist: "Shaz Khan", hue: 150 },
  { id: "h10", title: "Mohabbat Ke Sajday", artist: "Unknown", hue: 36 },
];

const BUCKET = "naat-audio";

function publicUrl(trackId: string, ext = "mp3") {
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(`${trackId}.${ext}`);
  // Cache-bust query param will be appended at fetch time when needed.
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
  hasAudio,
  onUploaded,
}: {
  track: Track;
  isPlaying: boolean;
  onTogglePlay: (url: string | null) => void;
  audioUrl: string | null;
  hasAudio: boolean;
  onUploaded: (id: string) => void;
}) {
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleUploadClick = () => {
    if (!user) {
      toast.error("Please sign in to upload audio");
      return;
    }
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("audio/")) {
      toast.error("Please choose an audio file");
      return;
    }
    setUploading(true);
    try {
      const { error } = await supabase.storage
        .from(BUCKET)
        .upload(`${track.id}.mp3`, file, {
          upsert: true,
          contentType: file.type || "audio/mpeg",
          cacheControl: "3600",
        });
      if (error) throw error;
      toast.success(`Uploaded "${track.title}"`);
      onUploaded(track.id);
    } catch (err) {
      console.error(err);
      toast.error("Upload failed");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handlePlay = () => {
    if (!hasAudio) {
      toast.message("No audio yet — upload one first.");
      return;
    }
    onTogglePlay(audioUrl);
  };

  return (
    <article className="group relative overflow-hidden rounded-2xl border border-border bg-card p-3 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-glow">
      <div className="relative aspect-square overflow-hidden rounded-xl">
        <GeometricPattern hue={track.hue} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent" />

        <button
          type="button"
          onClick={handleUploadClick}
          disabled={uploading}
          aria-label={`Upload audio for ${track.title}`}
          className="absolute left-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur transition hover:bg-black/60 disabled:opacity-50"
        >
          {uploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
        </button>

        {hasAudio && (
          <span className="absolute right-2 top-2 rounded-full bg-primary/90 px-2 py-0.5 text-[10px] font-medium text-primary-foreground">
            Audio
          </span>
        )}

        <button
          type="button"
          onClick={handlePlay}
          aria-label={`${isPlaying ? "Pause" : "Play"} ${track.title}`}
          className="absolute bottom-2 right-2 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-glow transition-transform hover:scale-110 group-hover:scale-105"
        >
          {isPlaying ? (
            <Pause className="h-4 w-4" fill="currentColor" />
          ) : (
            <Play className="ml-0.5 h-4 w-4" fill="currentColor" />
          )}
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept="audio/*"
          onChange={handleFileChange}
          className="hidden"
        />
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
  const [available, setAvailable] = useState<Record<string, number>>({}); // id -> version (cache-bust)

  // Probe which tracks already have audio uploaded.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data } = await supabase.storage.from(BUCKET).list("", { limit: 100 });
      if (cancelled || !data) return;
      const map: Record<string, number> = {};
      for (const obj of data) {
        const id = obj.name.replace(/\.[^.]+$/, "");
        map[id] = Date.now();
      }
      setAvailable(map);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const togglePlay = (track: Track, url: string | null) => {
    if (!url) return;
    if (playingId === track.id) {
      audioRef.current?.pause();
      setPlayingId(null);
      return;
    }
    if (audioRef.current) {
      audioRef.current.pause();
    }
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

  const handleUploaded = (id: string) => {
    setAvailable((prev) => ({ ...prev, [id]: Date.now() }));
  };

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
        {tracks.map((t) => {
          const version = available[t.id];
          const hasAudio = !!version;
          const url = hasAudio ? `${publicUrl(t.id)}?v=${version}` : null;
          return (
            <NaatCard
              key={t.id}
              track={t}
              isPlaying={playingId === t.id}
              audioUrl={url}
              hasAudio={hasAudio}
              onTogglePlay={(u) => togglePlay(t, u)}
              onUploaded={handleUploaded}
            />
          );
        })}
      </div>

      <p className="mt-6 text-center text-xs text-muted-foreground">
        Tap the upload icon on a card to add an MP3. Sign in required to upload.
      </p>
    </section>
  );
}
