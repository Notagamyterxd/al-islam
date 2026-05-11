insert into storage.buckets (id, name, public)
values ('naat-audio', 'naat-audio', true)
on conflict (id) do nothing;

create policy "Public can read naat audio"
on storage.objects for select
using (bucket_id = 'naat-audio');

create policy "Authenticated users can upload naat audio"
on storage.objects for insert
to authenticated
with check (bucket_id = 'naat-audio');

create policy "Authenticated users can update naat audio"
on storage.objects for update
to authenticated
using (bucket_id = 'naat-audio');

create policy "Authenticated users can delete naat audio"
on storage.objects for delete
to authenticated
using (bucket_id = 'naat-audio');