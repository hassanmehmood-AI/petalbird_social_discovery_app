-- Read-only inspection. Run in the SQL Editor of the SAME project used by Vercel.
-- This lists definitions; SQL Editor execution does not test application RLS.
select c.relname as table_name, c.relrowsecurity as rls_enabled,
       c.relforcerowsecurity as rls_forced
from pg_class c
join pg_namespace n on n.oid = c.relnamespace
where n.nspname = 'public' and c.relkind = 'r'
order by c.relname;

select schemaname, tablename, policyname, roles, cmd, qual, with_check
from pg_policies
where schemaname in ('public', 'storage')
order by schemaname, tablename, policyname;

select table_name, column_name, data_type
from information_schema.columns
where table_schema = 'public'
  and table_name in ('profiles', 'site_settings', 'contact_requests')
order by table_name, ordinal_position;

-- Check whether application roles have broad UPDATE rights on admin columns.
-- Policies/triggers may impose additional restrictions; inspect all together.
select grantee, table_name, privilege_type
from information_schema.role_table_grants
where table_schema = 'public' and grantee in ('anon', 'authenticated')
order by table_name, grantee, privilege_type;

select grantee, table_name, column_name, privilege_type
from information_schema.role_column_grants
where table_schema = 'public' and table_name = 'profiles'
  and grantee in ('anon', 'authenticated') and privilege_type = 'UPDATE'
order by grantee, column_name;

select c.relname as table_name, pg_get_triggerdef(t.oid) as trigger_definition
from pg_trigger t
join pg_class c on c.oid = t.tgrelid
join pg_namespace n on n.oid = c.relnamespace
where n.nspname = 'public' and not t.tgisinternal
order by c.relname, t.tgname;

select p.proname as function_name, pg_get_functiondef(p.oid) as definition
from pg_proc p
join pg_namespace n on n.oid = p.pronamespace
where n.nspname = 'public'
  and p.proname in ('create_or_get_conversation', 'update_post_avg_rating',
                    'sync_conversation_last_message', 'handle_new_user');

select id, name, public, file_size_limit, allowed_mime_types
from storage.buckets
where id in ('post-images', 'post-audio');
