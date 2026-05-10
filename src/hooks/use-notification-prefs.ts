import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./use-auth";
import type { PrayerName } from "./use-prayer-times";

export interface NotificationPrefs {
  prayers: Record<PrayerName, { enabled: boolean; minutesBefore: number }>;
  tasbih: { enabled: boolean; time: string }; // HH:mm daily
}

export const DEFAULT_PREFS: NotificationPrefs = {
  prayers: {
    Fajr: { enabled: false, minutesBefore: 5 },
    Dhuhr: { enabled: false, minutesBefore: 5 },
    Asr: { enabled: false, minutesBefore: 5 },
    Maghrib: { enabled: false, minutesBefore: 5 },
    Isha: { enabled: false, minutesBefore: 5 },
  },
  tasbih: { enabled: false, time: "20:00" },
};

export function useNotificationPrefs() {
  const { user } = useAuth();
  const [prefs, setPrefs] = useState<NotificationPrefs>(DEFAULT_PREFS);
  const [loaded, setLoaded] = useState(false);

  const refresh = useCallback(async () => {
    if (!user) {
      setPrefs(DEFAULT_PREFS);
      setLoaded(true);
      return;
    }
    const { data } = await supabase
      .from("notification_prefs")
      .select("prefs")
      .eq("user_id", user.id)
      .maybeSingle();
    if (data?.prefs) {
      setPrefs({ ...DEFAULT_PREFS, ...(data.prefs as unknown as NotificationPrefs) });
    }
    setLoaded(true);
  }, [user]);

  useEffect(() => { refresh(); }, [refresh]);

  const save = async (next: NotificationPrefs) => {
    setPrefs(next);
    if (!user) return;
    await supabase.from("notification_prefs").upsert({
      user_id: user.id,
      prefs: next as never,
      updated_at: new Date().toISOString(),
    });
  };

  return { prefs, save, loaded, isAuthed: !!user };
}
