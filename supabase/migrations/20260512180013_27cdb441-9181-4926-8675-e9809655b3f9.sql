
-- 1. Roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- 2. Role-check helper (SECURITY DEFINER avoids RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- 3. Promote the earliest-existing user to admin so the current owner keeps access
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::public.app_role
FROM auth.users
ORDER BY created_at ASC
LIMIT 1
ON CONFLICT DO NOTHING;

-- 4. Replace permissive storage policies with admin-only ones
DROP POLICY IF EXISTS "Authenticated users can upload naat audio" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update naat audio" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete naat audio" ON storage.objects;
DROP POLICY IF EXISTS "Public can read naat audio" ON storage.objects;

CREATE POLICY "Admins can upload naat audio"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'naat-audio' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update naat audio"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'naat-audio' AND public.has_role(auth.uid(), 'admin'))
  WITH CHECK (bucket_id = 'naat-audio' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete naat audio"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'naat-audio' AND public.has_role(auth.uid(), 'admin'));

-- Listing restricted to admins; public playback still works via the bucket's public URLs
CREATE POLICY "Admins can list naat audio"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (bucket_id = 'naat-audio' AND public.has_role(auth.uid(), 'admin'));
