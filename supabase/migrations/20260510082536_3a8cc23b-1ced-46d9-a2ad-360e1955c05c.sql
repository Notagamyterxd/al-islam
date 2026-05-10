
-- Prayer logs
CREATE TABLE public.prayer_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  prayer_date DATE NOT NULL,
  prayer_name TEXT NOT NULL CHECK (prayer_name IN ('Fajr','Dhuhr','Asr','Maghrib','Isha')),
  completed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, prayer_date, prayer_name)
);
ALTER TABLE public.prayer_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "view own prayer logs" ON public.prayer_logs FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "insert own prayer logs" ON public.prayer_logs FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "delete own prayer logs" ON public.prayer_logs FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Tasbih sessions
CREATE TABLE public.tasbih_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  dhikr TEXT NOT NULL DEFAULT 'SubhanAllah',
  count INTEGER NOT NULL DEFAULT 0,
  rounds INTEGER NOT NULL DEFAULT 0,
  session_date DATE NOT NULL DEFAULT (now() AT TIME ZONE 'UTC')::date,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.tasbih_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "view own tasbih" ON public.tasbih_sessions FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "insert own tasbih" ON public.tasbih_sessions FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "update own tasbih" ON public.tasbih_sessions FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "delete own tasbih" ON public.tasbih_sessions FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Notification preferences
CREATE TABLE public.notification_prefs (
  user_id UUID NOT NULL PRIMARY KEY,
  prefs JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.notification_prefs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "view own prefs" ON public.notification_prefs FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "insert own prefs" ON public.notification_prefs FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "update own prefs" ON public.notification_prefs FOR UPDATE TO authenticated USING (auth.uid() = user_id);
