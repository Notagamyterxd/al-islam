import { create } from "zustand";
import type { AudioTrack } from "@/data/audios";

interface PlayerState {
  current: AudioTrack | null;
  queue: AudioTrack[];
  isPlaying: boolean;
  progress: number;
  duration: number;
  volume: number;
  play: (track: AudioTrack, queue?: AudioTrack[]) => void;
  toggle: () => void;
  setProgress: (p: number) => void;
  setDuration: (d: number) => void;
  setVolume: (v: number) => void;
  next: () => void;
  prev: () => void;
  seek: number | null;
  requestSeek: (s: number) => void;
  clearSeek: () => void;
}

export const usePlayer = create<PlayerState>((set, get) => ({
  current: null,
  queue: [],
  isPlaying: false,
  progress: 0,
  duration: 0,
  volume: 0.8,
  seek: null,
  play: (track, queue) =>
    set({
      current: track,
      queue: queue ?? get().queue,
      isPlaying: true,
      progress: 0,
    }),
  toggle: () => set({ isPlaying: !get().isPlaying }),
  setProgress: (p) => set({ progress: p }),
  setDuration: (d) => set({ duration: d }),
  setVolume: (v) => set({ volume: v }),
  requestSeek: (s) => set({ seek: s }),
  clearSeek: () => set({ seek: null }),
  next: () => {
    const { current, queue } = get();
    if (!current || queue.length === 0) return;
    const idx = queue.findIndex((t) => t.id === current.id);
    const nextTrack = queue[(idx + 1) % queue.length];
    set({ current: nextTrack, isPlaying: true, progress: 0 });
  },
  prev: () => {
    const { current, queue } = get();
    if (!current || queue.length === 0) return;
    const idx = queue.findIndex((t) => t.id === current.id);
    const prevTrack = queue[(idx - 1 + queue.length) % queue.length];
    set({ current: prevTrack, isPlaying: true, progress: 0 });
  },
}));
