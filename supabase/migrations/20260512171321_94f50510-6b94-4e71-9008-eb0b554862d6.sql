DROP POLICY IF EXISTS "Authenticated can read naat audio" ON storage.objects;
CREATE POLICY "Public can read naat audio" ON storage.objects FOR SELECT USING (bucket_id = 'naat-audio');