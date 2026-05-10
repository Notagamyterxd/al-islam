import { useQuery } from "@tanstack/react-query";

export type PrayerName = "Fajr" | "Dhuhr" | "Asr" | "Maghrib" | "Isha";
export const PRAYERS: PrayerName[] = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];

export interface PrayerTimes {
  date: string; // YYYY-MM-DD
  hijri: string;
  timings: Record<PrayerName, string>; // "HH:mm"
}

const CITY = "Neuss";
const COUNTRY = "Germany";

export function useTodayPrayerTimes() {
  return useQuery<PrayerTimes>({
    queryKey: ["prayer-times", "today", CITY, COUNTRY],
    queryFn: async () => {
      const today = new Date();
      const dd = String(today.getDate()).padStart(2, "0");
      const mm = String(today.getMonth() + 1).padStart(2, "0");
      const yyyy = today.getFullYear();
      const url = `https://api.aladhan.com/v1/timingsByCity/${dd}-${mm}-${yyyy}?city=${CITY}&country=${COUNTRY}&method=3`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch prayer times");
      const json = await res.json();
      const t = json.data.timings;
      return {
        date: `${yyyy}-${mm}-${dd}`,
        hijri: `${json.data.date.hijri.day} ${json.data.date.hijri.month.en} ${json.data.date.hijri.year} AH`,
        timings: {
          Fajr: t.Fajr,
          Dhuhr: t.Dhuhr,
          Asr: t.Asr,
          Maghrib: t.Maghrib,
          Isha: t.Isha,
        },
      };
    },
    staleTime: 1000 * 60 * 30,
  });
}

export function prayerTimeToDate(dateStr: string, hhmm: string): Date {
  const [h, m] = hhmm.split(":").map(Number);
  const [y, mo, d] = dateStr.split("-").map(Number);
  return new Date(y, mo - 1, d, h, m, 0, 0);
}

export function todayLocalISO(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
