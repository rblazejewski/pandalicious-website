# pandalicious.co.uk

Static landing page with a Kickstarter waitlist. Plain HTML/CSS/JS, no build step.

- `index.html`, `privacy.html`, `404.html`, `styles.css`, `main.js`
- Palette mirrors the app's V3 tokens (`../PanDalicious/constants/theme.ts`), light and dark.
- `assets/panda.png|webp` is the app's `onboarding/logo.png` with the outer white made transparent. `assets/og-image.png` is the link-preview image.

## Waitlist

`main.js` calls the `join_waitlist()` Postgres function (migration `20260930120000_waitlist_signups.sql` in the app repo) with the app's public publishable key. The `waitlist_signups` table is closed to the API roles, so the list can only be read with the service role or `psql`:

```sql
select email, created_at from public.waitlist_signups order by created_at;
```

## Run locally

```bash
python3 -m http.server 8765
```

## Hosting

GitHub Pages from the repo root; `CNAME` holds the custom domain. DNS is at Squarespace Domains:

| Type  | Host | Value |
|-------|------|-------|
| A     | @    | 185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153 |
| AAAA  | @    | 2606:50c0:8000::153, 2606:50c0:8001::153, 2606:50c0:8002::153, 2606:50c0:8003::153 |
| CNAME | www  | rblazejewski.github.io |

Verify the domain in GitHub (Settings → Pages → verified domains) before adding it to the repo, and don't add wildcard records. Leave room for the Resend email records on the same domain.
