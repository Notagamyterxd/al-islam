CREATE TABLE public.chat_threads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  title text NOT NULL DEFAULT 'New chat',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_chat_threads_user ON public.chat_threads(user_id, updated_at DESC);

ALTER TABLE public.chat_threads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "view own threads" ON public.chat_threads FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "insert own threads" ON public.chat_threads FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "update own threads" ON public.chat_threads FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "delete own threads" ON public.chat_threads FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE TABLE public.chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id uuid NOT NULL REFERENCES public.chat_threads(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  role text NOT NULL CHECK (role IN ('user','assistant','system')),
  message jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_chat_messages_thread ON public.chat_messages(thread_id, created_at);

ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "view own messages" ON public.chat_messages FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "insert own messages" ON public.chat_messages FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "delete own messages" ON public.chat_messages FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.touch_chat_thread()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  UPDATE public.chat_threads SET updated_at = now() WHERE id = NEW.thread_id;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_touch_chat_thread
AFTER INSERT ON public.chat_messages
FOR EACH ROW EXECUTE FUNCTION public.touch_chat_thread();