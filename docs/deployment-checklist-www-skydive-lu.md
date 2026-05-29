# Deployment checklist — www.skydive.lu

Status: preparation only. Do not switch DNS or deploy publicly without explicit approval from Fränz / SDL.

## Current target

- Canonical production domain: `https://www.skydive.lu`
- Default language path: `/en/`
- Static build output: `dist/`
- Build command: `npm run build`
- Required Node version: `22.12.0` or newer
- Existing DNS currently resolves `skydive.lu`, `www.skydive.lu`, `cerclepara.lu`, and `www.cerclepara.lu` to `195.26.5.2`.

## Pre-deployment gate

Before touching the live domain:

- [ ] Club approves final copy in EN/FR/DE.
- [ ] Club confirms phone number, email, RCS number, and legal imprint wording.
- [ ] Club confirms tandem/AFF/fun-jumper prices and restrictions.
- [ ] Club confirms all public photos may be used.
- [ ] Booking link to DZ-Cloud is approved and tested.
- [ ] Contact/AFF/fun-jumper forms are tested on the chosen host.
- [ ] Hosting account and access are confirmed.
- [ ] Rollback method is confirmed.

## Local verification

Run from repo root:

```bash
npm install
npm run build
npm run preview -- --host 127.0.0.1 --port 4321
```

Check locally:

- [ ] `/` redirects or forwards to `/en/`.
- [ ] `/en/`, `/fr/`, `/de/` load.
- [ ] Main pages load in all languages:
  - [ ] About
  - [ ] Tandem
  - [ ] AFF
  - [ ] Fun jumpers
  - [ ] Pricing
  - [ ] Gallery
  - [ ] FAQ
  - [ ] Contact
  - [ ] Imprint
  - [ ] Privacy
  - [ ] Cookies
- [ ] No broken internal links.
- [ ] Every page has exactly one H1.
- [ ] Every page has a meta description.
- [ ] Canonicals point to `https://www.skydive.lu/...`.
- [ ] Homepage and gallery images load after scroll/lazy-load.
- [ ] Browser console has no JavaScript errors.
- [ ] `dist/robots.txt` exists.
- [ ] `dist/sitemap-index.xml` exists.

## Hosting configuration

The repo now contains `netlify.toml` for a static Netlify deployment:

- build command: `npm run build`
- publish directory: `dist`
- Node version: `22.12.0`
- canonical redirect from `skydive.lu` to `www.skydive.lu`
- root redirect from `/` to `/en/`
- legacy URL redirects for audited old WordPress/CPL-era URLs
- security headers
- long cache headers for `/_astro/*`

If using another host, manually reproduce the same redirects and headers.

## DNS switch plan

Only after approval:

1. Create the hosting site/project and deploy a preview build.
2. Test the preview URL fully.
3. Add `www.skydive.lu` as the primary custom domain on the host.
4. Add `skydive.lu` as a secondary domain that redirects to `www.skydive.lu`.
5. Update DNS according to the host instructions.
6. Keep the old host available until the new site is verified.
7. Verify TLS certificate issuance.
8. Verify both domains:
   - `https://www.skydive.lu/`
   - `https://skydive.lu/`
9. Verify legacy redirects from old URLs.
10. Submit sitemap in Google Search Console once stable:
    - `https://www.skydive.lu/sitemap-index.xml`

## Post-deployment smoke test

Immediately after DNS/TLS is live:

```bash
curl -I https://www.skydive.lu/
curl -I https://skydive.lu/
curl -I https://www.skydive.lu/en/
curl -I https://www.skydive.lu/sitemap-index.xml
curl -I https://www.skydive.lu/robots.txt
```

Check:

- [ ] `www.skydive.lu` returns 200/redirects correctly.
- [ ] apex `skydive.lu` redirects to `www.skydive.lu`.
- [ ] HTTPS certificate is valid.
- [ ] Security headers are present.
- [ ] Forms submit and arrive in the configured inbox/backend.
- [ ] DZ-Cloud booking handoff opens correctly.
- [ ] No 404s in browser console/network panel for core pages.

## Rollback

If launch breaks:

1. Revert DNS to the old host, or
2. Roll back to the previous deploy in the hosting provider dashboard.

Keep old hosting/DNS settings documented before changing anything.
