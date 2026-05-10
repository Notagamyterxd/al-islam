import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./use-auth";
import type { PrayerName } from "./use-prayer-times";

export interface PrayerLog {
  prayer_date: string;
  prayer_name: PrayerName;
  completed_at: string;
}

export function usePrayerLogs(monthStart: string, monthEnd: string) {
  const { user } = useAuth();
  const [logs, setLogs] = useState<PrayerLog[]>([]);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!user) {
      setLogs([]);
      return;
    }
    setLoading(true);
    const { data } = await supabase
      .from("prayer_logs")
      .select("prayer_date,prayer_name,completed_at")
      .gte("prayer_date", monthStart)
      .lte("prayer_date", monthEnd);
    setLogs((data as PrayerLog[]) ?? []);
    setLoading(false);
  }, [user, monthStart, monthEnd]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const togglePrayer = async (date: string, prayer: PrayerName) => {
    if (!user) return false;
    const existing = logs.find((l) => l.prayer_date === date && l.prayer_name === prayer);
    if (existing) {
      await supabase
        .from("prayer_logs")
        .delete()
        .eq("user_id", user.id)
        .eq("prayer_date", date)
        .eq("prayer_name", prayer);
      setLogs((p) => p.filter((l) => !(l.prayer_date === date && l.prayer_name === prayer)));
    } else {
      await supabase.from("prayer_logs").insert({
        user_id: user.id,
        prayer_date: date,
        prayer_name: prayer,
      });
      setLogs((p) => [
        ...p,
        { prayer_date: date, prayer_name: prayer, completed_at: new Date().toISOString() },
      ]);
    }
    return true;
  };

  return { logs, togglePrayer, refresh, loading, isAuthed: !!user };
}
