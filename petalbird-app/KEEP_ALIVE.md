# Supabase keep-alive verification

The `/api/health` route reads one profile ID using the anon key and reports database
connectivity. It does not return profile data. A successful request does not prove
that every application RLS policy is correct. Free-plan keep-alive traffic also
does not guarantee exemption from Supabase's inactivity policy.

## Configure and deploy

1. In Vercel, confirm the project's Root Directory is `petalbird-app`.
2. Under Settings > Environment Variables, retain the application's existing
   `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in Production.
   The probe optionally uses `SUPABASE_URL` / `SUPABASE_ANON_KEY` instead; if set,
   they must point to the same project. Never use a service-role key for this probe.
3. Recommended: add `CRON_SECRET`, a random secret of at least 16 characters, in
   Production. Vercel sends it as `Authorization: Bearer <secret>`. When configured,
   opening the endpoint normally in a browser returns 401, as expected.
4. Choose a schedule from the app directory:

   ```powershell
   node scripts/cron-schedule.mjs test
   ```

   This selects `*/3 * * * *`. Vercel **Pro/Enterprise** supports this schedule.
   Hobby allows at most once daily and rejects a three-minute configuration.
   On Hobby, retain the production schedule and use the external test below.
5. Deploy the changes to **Production** through your normal Git/Vercel workflow.
   Preview deployments do not run cron jobs. Environment-variable and schedule
   changes require a new deployment.

## Verify Vercel execution

1. Open your project > Settings > Cron Jobs. Confirm `/api/health` and the selected
   schedule appear and jobs are enabled.
2. Use Run to trigger the job manually, then View Logs (or Runtime Logs filtered
   to `/api/health`). Look for `[supabase-keep-alive]` with `ok: true`, a timestamp,
   and duration. Expect HTTP 200 and `database: reachable`.
3. On Pro/Enterprise, watch for at least three scheduled runs over about ten
   minutes. A manual Run proves the endpoint works; scheduled logs prove the
   scheduler is invoking it. Do not infer success from the config file alone.
4. In Supabase > Logs > API/PostgREST, inspect the corresponding
   `/rest/v1/profiles?select=id&limit=1` requests and their response status.

Status meanings: 401 = missing/wrong cron secret; 500 = missing environment
configuration; 503 = database request failed (paused project, permission error,
network failure or timeout). A 404 suggests the wrong deployment/root directory;
a redirect or deployment-protection page does not prove a database query ran.
If paused, first resume the project from Supabase Dashboard.

## Three-minute testing on Vercel Hobby

This repository retains the three-day Vercel schedule for the Hobby deployment.

For a bounded test without creating an external account, open a terminal in
`petalbird-app` and run:

```powershell
node scripts/probe-deployment.mjs https://petalbird-app.vercel.app
```

Use your actual production domain if different. The script makes three requests:
immediately, after three minutes, and after six minutes, then exits. Keep the
terminal open. Each result must have `passed: true` and a distinct server timestamp.
If `CRON_SECRET` is configured, load it into the terminal environment first without
typing the secret into shell history:

```powershell
$enteredSecret = Read-Host 'CRON_SECRET' -AsSecureString
$env:CRON_SECRET = [System.Net.NetworkCredential]::new('', $enteredSecret).Password
node scripts/probe-deployment.mjs https://petalbird-app.vercel.app
Remove-Item Env:CRON_SECRET
```

Use an external scheduler such as cron-job.org to call the deployed
`https://<your-production-domain>/api/health` using GET every three minutes.
If `CRON_SECRET` is configured, add the custom header
`Authorization: Bearer <your-secret>`. Keep it out of source control.
Inspect both the scheduler's execution history and Vercel logs for HTTP 200.
This verifies external scheduling and the deployed function; it does not verify
Vercel's own automatic schedule. Verify that separately with its manual Run and
next permitted scheduled invocation. Stop the temporary external job after testing.

## Restore the requested three-day schedule

After successful testing, run:

```powershell
node scripts/cron-schedule.mjs production
```

This restores `0 9 */3 * *` (09:00 UTC / 14:00 Pakistan time on matching days).
The day-of-month step resets each month; it is not exactly every 72 hours.
Redeploy to Production, then confirm the changed schedule in Cron Jobs.
For more regular activity, `node scripts/cron-schedule.mjs daily` selects a
Hobby-compatible daily schedule. Supabase says a few database requests each day
are typically enough; the requested three-day schedule is less frequent.

## Inspect live database policies

Run `scripts/verify-database-policies.sql` in the SQL Editor of the project used
by Vercel. It only reads metadata and storage-bucket configuration.

- Check RLS is enabled on application tables, including newer `site_settings`
  and `contact_requests` tables.
- Check actual profile columns include admin/deactivation, cover and audio fields.
  The repository's original `supabase_schema.sql` does not include those additions.
- Check `create_or_get_conversation` exists, and inspect its authorization logic.
- Check participants can read the other participant needed by the message sidebar;
  outsiders must not read a conversation or its messages.
- Check regular users cannot modify admin flags, deactivation flags, or another
  user's records. An own-row UPDATE policy alone does not restrict which columns
  a user may change; inspect column privileges/triggers too.
- Check required storage buckets and upload/read/delete policies.

The SQL Editor runs with privileged access, so it cannot prove RLS enforcement.
Use two disposable normal accounts, A and B, and an admin account through the app
or authenticated REST requests (anon API key plus each user's access token).
Verify A cannot update B's profile/posts or join/read an unrelated conversation;
verify a non-admin receives 403 from admin APIs; verify only a super admin can
promote/demote accounts. An RLS-denied UPDATE may return no error but affect zero
rows: check affected rows and read back as the owner. Use disposable records for
write tests and never share access tokens. Do not apply the old schema to a live
database to repair gaps without first reviewing the actual policies.

## Local checks

```powershell
node --test scripts/test-keep-alive.mjs
npm.cmd run lint
npx.cmd tsc --noEmit
```

References:
- https://vercel.com/docs/cron-jobs/usage-and-pricing
- https://vercel.com/docs/cron-jobs/manage-cron-jobs
- https://supabase.com/docs/guides/platform/free-project-pausing
- https://supabase.com/docs/guides/database/postgres/row-level-security
