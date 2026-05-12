DROP POLICY IF EXISTS "Authenticated users can update naat audio" ON storage.objects;
CREATE POLICY "Authenticated users can update naat audio" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'naat-audio')
  WITH CHECK (bucket_id = 'naat-audio');