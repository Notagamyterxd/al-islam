drop policy if exists "Public can read naat audio" on storage.objects;

create policy "Authenticated can read naat audio"
on storage.objects for select
to authenticated
using (bucket_id = 'naat-audio');