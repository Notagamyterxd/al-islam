import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./use-auth";

export type Dhikr = "SubhanAllah" | "Alhamdulillah" | "Allahu Akbar";

export interface TasbihSession {
  id: string;
  dhikr: Dhikr;
  count: number;
  rounds: number;
  session_date: string;
}

function todayISO() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function useTasbih() {
  const { user } = useAuth();
  const [dhikr, setDhikr] = useState<Dhikr>("SubhanAllah");
  const [count, setCount] = useState(0);
  const [rounds, setRounds] = useState(0);
  const [session, setSession] = useState<TasbihSession | null>(null);
  const [monthSessions, setMonthSessions] = useState<TasbihSession[]>([]);

  const loadOrCreate = useCallback(async (selected: Dhikr) => {
    if (!user) return;
    const today = todayISO();
    const { data } = await supabase
      .from("tasbih_sessions")
      .select("*")
      .eq("user_id", user.id)
      .eq("session_date", today)
      .eq("dhikr", selected)
      .maybeSingle();
    if (data) {
      setSession(data as TasbihSession);
      setCount(data.count);
      setRounds(data.rounds);
    } else {
      const { data: created } = await supabase
        .from("tasbih_sessions")
        .insert({ user_id: user.id, dhikr: selected, count: 0, rounds: 0, session_date: today })
        .select()
        .single();
      setSession(created as TasbihSession);
      setCount(0);
      setRounds(0);
    }
  }, [user]);

  const loadMonth = useCallback(async () => {
    if (!user) return;
    const d = new Date();
    const start = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-01`;
    const { data } = await supabase
      .from("tasbih_sessions")
      .select("*")
      .eq("user_id", user.id)
      .gte("session_date", start);
    setMonthSessions((data as TasbihSession[]) ?? []);
  }, [user]);

  useEffect(() => { loadOrCreate(dhikr); }, [dhikr, loadOrCreate]);
  useEffect(() => { loadMonth(); }, [loadMonth]);

  const persist = async (newCount: number, newRounds: number) => {
    if (!session) return;
    await supabase
      .from("tasbih_sessions")
      .update({ count: newCount, rounds: newRounds, updated_at: new Date().toISOString() })
      .eq("id", session.id);
  };

  const increment = () => {
    let nc = count + 1;
    let nr = rounds;
    if (nc >= 100) {
      nc = 0;
      nr += 1;
    }
    setCount(nc);
    setRounds(nr);
    persist(nc, nr);
  };

  const reset = () => {
    setCount(0);
    setRounds(0);
    persist(0, 0);
    loadMonth();
  };

  const totalMonthRounds = monthSessions.reduce((s, x) => s + x.rounds, 0);
  const totalMonthBeads = monthSessions.reduce((s, x) => s + x.rounds * 100 + x.count, 0);

  return {
    dhikr, setDhikr, count, rounds, increment, reset,
    isAuthed: !!user,
    totalMonthRounds, totalMonthBeads, monthSessions,
  };
}
