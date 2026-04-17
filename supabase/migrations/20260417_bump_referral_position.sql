create or replace function public.bump_referral_position(p_ref_code text)
returns void
language plpgsql
security definer
as $$
declare
  referral_count integer := 0;
  bonus integer := 50;
begin
  select count(*) into referral_count
  from public.waitlist
  where referred_by = p_ref_code;

  if referral_count >= 3 then
    bonus := 200;
  end if;

  update public.waitlist
  set position = greatest(position - bonus, 1)
  where ref_code = p_ref_code;
end;
$$;
