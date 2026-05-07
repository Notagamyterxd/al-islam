export type AudioCategory = "quran" | "dua" | "reminder" | "lofi" | "ambient" | "nature";
export type AudioSection = "reminders" | "music";

export interface AudioTrack {
  id: string;
  title: string;
  author: string;
  category: AudioCategory;
  section: AudioSection;
  url: string;
  duration: string;
  gradient: string;
}

// Demo placeholder audio URLs (free / sample MP3s)
const DEMO_QURAN = "https://server8.mp3quran.net/afs/001.mp3";
const DEMO_QURAN_2 = "https://server8.mp3quran.net/afs/112.mp3";
const DEMO_QURAN_3 = "https://server8.mp3quran.net/afs/113.mp3";
const DEMO_QURAN_4 = "https://server8.mp3quran.net/afs/114.mp3";
const LOFI_1 = "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3";
const LOFI_2 = "https://cdn.pixabay.com/download/audio/2022/03/15/audio_1718e49c66.mp3";
const LOFI_3 = "https://cdn.pixabay.com/download/audio/2022/10/30/audio_347111d624.mp3";
const AMBIENT_1 = "https://cdn.pixabay.com/download/audio/2022/03/10/audio_2dde668ca0.mp3";
const RAIN = "https://cdn.pixabay.com/download/audio/2022/03/10/audio_b7e6e0a6a3.mp3";
const FOREST = "https://cdn.pixabay.com/download/audio/2021/09/06/audio_2c6c6e6e44.mp3";

export const audios: AudioTrack[] = [
  // Reminders section
  {
    id: "r1",
    title: "Surah Al-Fatiha",
    author: "Mishary Al-Afasy",
    category: "quran",
    section: "reminders",
    url: DEMO_QURAN,
    duration: "0:42",
    gradient: "from-indigo-600 to-violet-700",
  },
  {
    id: "r2",
    title: "Surah Al-Ikhlas",
    author: "Mishary Al-Afasy",
    category: "quran",
    section: "reminders",
    url: DEMO_QURAN_2,
    duration: "0:30",
    gradient: "from-blue-700 to-indigo-800",
  },
  {
    id: "r3",
    title: "Surah Al-Falaq",
    author: "Mishary Al-Afasy",
    category: "quran",
    section: "reminders",
    url: DEMO_QURAN_3,
    duration: "0:35",
    gradient: "from-violet-700 to-purple-800",
  },
  {
    id: "r4",
    title: "Surah An-Nas",
    author: "Mishary Al-Afasy",
    category: "quran",
    section: "reminders",
    url: DEMO_QURAN_4,
    duration: "0:38",
    gradient: "from-indigo-700 to-blue-900",
  },
  {
    id: "r5",
    title: "Morning Dua",
    author: "Daily Reminders",
    category: "dua",
    section: "reminders",
    url: DEMO_QURAN_2,
    duration: "1:12",
    gradient: "from-purple-600 to-indigo-700",
  },
  {
    id: "r6",
    title: "Patience in Hardship",
    author: "Short Reminders",
    category: "reminder",
    section: "reminders",
    url: DEMO_QURAN_3,
    duration: "0:55",
    gradient: "from-indigo-500 to-violet-600",
  },
  {
    id: "r7",
    title: "Evening Dua",
    author: "Daily Reminders",
    category: "dua",
    section: "reminders",
    url: DEMO_QURAN_4,
    duration: "1:05",
    gradient: "from-blue-600 to-indigo-700",
  },
  {
    id: "r8",
    title: "Trust in Allah",
    author: "Short Reminders",
    category: "reminder",
    section: "reminders",
    url: DEMO_QURAN,
    duration: "0:48",
    gradient: "from-violet-600 to-indigo-800",
  },

  // Music section
  {
    id: "m1",
    title: "Lofi Study Beats",
    author: "Chill Vibes",
    category: "lofi",
    section: "music",
    url: LOFI_1,
    duration: "2:30",
    gradient: "from-indigo-500 to-purple-700",
  },
  {
    id: "m2",
    title: "Late Night Focus",
    author: "Chill Vibes",
    category: "lofi",
    section: "music",
    url: LOFI_2,
    duration: "3:10",
    gradient: "from-blue-600 to-violet-800",
  },
  {
    id: "m3",
    title: "Soft Piano Study",
    author: "Calm Keys",
    category: "lofi",
    section: "music",
    url: LOFI_3,
    duration: "2:50",
    gradient: "from-violet-500 to-indigo-700",
  },
  {
    id: "m4",
    title: "Ambient Space",
    author: "Deep Focus",
    category: "ambient",
    section: "music",
    url: AMBIENT_1,
    duration: "4:20",
    gradient: "from-indigo-700 to-blue-900",
  },
  {
    id: "m5",
    title: "Gentle Rain",
    author: "Nature Sounds",
    category: "nature",
    section: "music",
    url: RAIN,
    duration: "3:00",
    gradient: "from-blue-500 to-indigo-700",
  },
  {
    id: "m6",
    title: "Forest Morning",
    author: "Nature Sounds",
    category: "nature",
    section: "music",
    url: FOREST,
    duration: "3:30",
    gradient: "from-emerald-700 to-indigo-800",
  },
];

export const remindersAudios = audios.filter((a) => a.section === "reminders");
export const musicAudios = audios.filter((a) => a.section === "music");

export const getAudioById = (id: string) => audios.find((a) => a.id === id);
