import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./use-auth";

export function useFavorites() {
  const { user } = useAuth();
  const [ids, setIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!user) {
      setIds(new Set());
      return;
    }
    setLoading(true);
    const { data } = await supabase.from("favorites").select("audio_id");
    setIds(new Set((data ?? []).map((r) => r.audio_id)));
    setLoading(false);
  }, [user]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const toggle = async (audioId: string) => {
    if (!user) return false;
    if (ids.has(audioId)) {
      await supabase.from("favorites").delete().eq("audio_id", audioId).eq("user_id", user.id);
      setIds((p) => {
        const n = new Set(p);
        n.delete(audioId);
        return n;
      });
    } else {
      await supabase.from("favorites").insert({ audio_id: audioId, user_id: user.id });
      setIds((p) => new Set(p).add(audioId));
    }
    return true;
  };

  return { ids, toggle, refresh, loading, isAuthed: !!user };
}
