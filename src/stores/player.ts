import { create } from "zustand";
import { type Surah, audioUrl } from "@/data/surahs";

interface PlayerState {
  current: Surah | null;
  queue: Surah[];
  isPlaying: boolean;
  progress: number;
  duration: number;
  volume: number;
  loop: boolean;
  autoPlay: boolean;
  seek: number | null;
  playbackRate: number;
  showTranscript: boolean;
  setPlaybackRate: (r: number) => void;
  toggleTranscript: () => void;
  play: (surah: Surah, queue?: Surah[]) => void;
  toggle: () => void;
  stop: () => void;
  setProgress: (p: number) => void;
  setDuration: (d: number) => void;
  setVolume: (v: number) => void;
  toggleLoop: () => void;
  toggleAutoPlay: () => void;
  next: () => void;
  prev: () => void;
  requestSeek: (s: number) => void;
  clearSeek: () => void;
  getUrl: () => string | null;
}

export const usePlayer = create<PlayerState>((set, get) => ({
  current: null,
  queue: [],
  isPlaying: false,
  progress: 0,
  duration: 0,
  volume: 0.85,
  loop: false,
  autoPlay: true,
  seek: null,
  playbackRate: 1,
  showTranscript: false,
  setPlaybackRate: (r) => set({ playbackRate: r }),
  toggleTranscript: () => set({ showTranscript: !get().showTranscript }),
  play: (surah, queue) =>
    set({
      current: surah,
      queue: queue ?? get().queue,
      isPlaying: true,
      progress: 0,
    }),
  toggle: () => set({ isPlaying: !get().isPlaying }),
  stop: () => set({ current: null, isPlaying: false, progress: 0 }),
  setProgress: (p) => set({ progress: p }),
  setDuration: (d) => set({ duration: d }),
  setVolume: (v) => set({ volume: v }),
  toggleLoop: () => set({ loop: !get().loop }),
  toggleAutoPlay: () => set({ autoPlay: !get().autoPlay }),
  requestSeek: (s) => set({ seek: s }),
  clearSeek: () => set({ seek: null }),
  getUrl: () => {
    const c = get().current;
    return c ? audioUrl(c.id) : null;
  },
  next: () => {
    const { current, queue } = get();
    if (!current || queue.length === 0) return;
    const idx = queue.findIndex((t) => t.id === current.id);
    const nextItem = queue[(idx + 1) % queue.length];
    set({ current: nextItem, isPlaying: true, progress: 0 });
  },
  prev: () => {
    const { current, queue } = get();
    if (!current || queue.length === 0) return;
    const idx = queue.findIndex((t) => t.id === current.id);
    const prevItem = queue[(idx - 1 + queue.length) % queue.length];
    set({ current: prevItem, isPlaying: true, progress: 0 });
  },
}));
