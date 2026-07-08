# Auto-updating Google reviews

The reviews section on the Home and Tandem pages (the star rating, the review
count, and up to 5 real review quote cards) is fetched from Google **at build
time** and baked into the static HTML. Nothing runs in the visitor's browser,
so the site's strict Content-Security-Policy is untouched and no third-party
script or cookie is loaded.

- Data layer: [`src/data/googleReviews.js`](../src/data/googleReviews.js)
- Cards UI: [`src/components/sections/GoogleReviewCards.astro`](../src/components/sections/GoogleReviewCards.astro)
- Rating badge: [`src/components/sections/GoogleRating.astro`](../src/components/sections/GoogleRating.astro)
- Scheduled refresh: [`.github/workflows/refresh-google-reviews.yml`](../.github/workflows/refresh-google-reviews.yml)

## How it works

1. During `astro build`, `getGoogleReviews()` calls the **Google Places API
   (New)** Place Details endpoint once, using two build-time secrets.
2. The rating / count / reviews are rendered into the static pages.
3. A weekly GitHub Actions cron pings a **Netlify build hook**, which rebuilds
   the site so the numbers refresh on their own.
4. If the secrets are missing (local dev, deploy previews) or the fetch fails,
   the build **falls back** to the last-known static rating and renders no
   review cards — the build never breaks.

## One-time setup

### 1. Find the Google Place ID

The Place ID identifies the dropzone's Google listing. Get it once from the
[Place ID Finder](https://developers.google.com/maps/documentation/places/web-service/place-id)
(search "Skydive Luxembourg", Noertrange). It looks like `ChIJ....`. Place IDs
are stable and are the one value Google lets you store indefinitely.

### 2. Create a Google Cloud project + Places API key

1. In the [Google Cloud Console](https://console.cloud.google.com/), create a
   project and attach a **billing account** (a card is required even though we
   stay in the free tier — see cost below).
2. Enable **Places API (New)**.
3. Create an **API key**. Under key restrictions, limit it to *Places API
   (New)*. (An IP/HTTP-referrer restriction isn't practical for a Netlify build
   runner, so rely on the API restriction + keeping the key secret.)

### 3. Set the Netlify build environment variables

Netlify → Site → **Project configuration → Environment variables**. Add, scoped
to **Builds**, and flag them as containing secret values:

| Key | Value |
| --- | --- |
| `GOOGLE_PLACES_API_KEY` | the key from step 2 |
| `GOOGLE_PLACE_ID` | the Place ID from step 1 |
| `GOOGLE_PLACES_LANGUAGE` | *(optional)* review-text language, default `en` |

Do **not** prefix them with `PUBLIC_` — that would leak the key into the
browser bundle. They stay server-side during the build only.

### 4. Wire up the weekly refresh

1. Netlify → **Build & deploy → Build hooks → Add build hook** (branch `main`).
   Copy the URL.
2. GitHub repo → **Settings → Secrets and variables → Actions → New repository
   secret** → name `NETLIFY_BUILD_HOOK`, value = the hook URL.

The workflow runs Mondays 06:00 UTC and can be run manually from the Actions
tab. Until the secret is set it no-ops (won't fail).

## Verifying it works

Trigger a Netlify deploy (or run the build locally with the two env vars set)
and check the build log for:

```
[google-reviews] Fetched from Google: rating 4.x, NN ratings, N review card(s).
```

If instead you see `… not set — using fallback aggregate …` or a `Places API
returned <status>` warning, the env vars are missing or the key/Place ID is
wrong; the site still builds using the static fallback.

## Cost

Practically free. The rating + count fields sit in the *Place Details
Enterprise* SKU (1,000 free calls/month); adding review bodies bumps the call
to *Enterprise + Atmosphere* (also 1,000 free/month). One build = one call, so a
weekly rebuild is ~4–5 calls/month — far under the free allotment. List price
beyond it is ~US$25 per 1,000 calls. A billing account is still required to
enable the key. *(Google pricing as of the March 2025 change — verify on the
[pricing page](https://developers.google.com/maps/billing-and-pricing/pricing)
before relying on it.)*

## Terms & compliance notes

- **30-day cache rule.** Google's Maps Platform terms allow caching review
  content for at most 30 days. The weekly rebuild refreshes well within that.
  **Never commit fetched review text into the repo** — it only ever lives in
  the throwaway `dist/` output. (The code fetches in memory and renders; it
  writes nothing to source.)
- **Attribution.** Cards show the author name/photo, link back to the review on
  Google, and the block is labelled "Reviews from Google", as Google requires.
  Review text is shown verbatim (long text is clamped with CSS, never edited).
- **No self-serving rich-result markup.** We deliberately do **not** emit
  `aggregateRating` / `Review` schema.org JSON-LD for our own rating: Google
  ignores a business's self-reviews for star rich results anyway, so it would
  add no SEO value and muddy the structured data. Keep it out.
- **Reviews are capped at 5.** The Places API returns at most 5 "most relevant"
  reviews with no pagination — there is no official way to show all of them.
  Showing more would require the Google Business Profile API (listing ownership
  + OAuth + Google approval), which is out of scope here.

## Limitations / future ideas

- Review text is fetched once in a single language (default `en`) and shown on
  all locales. Per-locale translation would mean one fetch per language.
- To show more than 5 reviews, migrate to the Google Business Profile API run
  from a build/serverless step (keeps the CSP model intact).
