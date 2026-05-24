-- Fix function search_path
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Tighten permissive insert policies
drop policy "Anyone can subscribe" on public.subscribers;
create policy "Anyone can subscribe"
  on public.subscribers for insert
  to anon, authenticated
  with check (email is not null and length(email) between 5 and 320 and email like '%_@_%.__%');

drop policy "Anyone can claim (insert unlocks)" on public.unlocks;
create policy "Anyone can claim (insert unlocks)"
  on public.unlocks for insert
  to anon, authenticated
  with check (email is not null and length(email) between 5 and 320 and email like '%_@_%.__%' and app_id is not null);

-- Lock down has_role so it is only callable via policies (definer context),
-- not directly from client-exposed RPC.
revoke execute on function public.has_role(uuid, public.app_role) from public, anon, authenticated;
