/* =========================================================================
   Skydive Luxembourg - Google rating (social proof)
   -------------------------------------------------------------------------
   Live aggregate rating + a few real reviews, fetched from Google at BUILD
   TIME and baked into the static HTML. No client-side script, no browser
   network call — so the strict CSP (script-src 'self' / connect-src 'self')
   stays untouched and the visitor's browser never talks to Google.

   HOW IT REFRESHES
     `getGoogleReviews()` calls the Google Places API (New) Place Details
     endpoint during `astro build`. A scheduled Netlify rebuild
     (.github/workflows/refresh-google-reviews.yml) re-runs the build
     periodically so the numbers stay current on their own.

   REQUIRED ENV (Netlify build environment; NEVER PUBLIC_-prefixed, never
   committed — see docs/google-reviews-auto-update.md):
     GOOGLE_PLACES_API_KEY   Places API (New) key
     GOOGLE_PLACE_ID         the dropzone's Google Place ID (store forever;
                             Place IDs are exempt from the cache limit)
     GOOGLE_PLACES_LANGUAGE  optional, defaults to 'en'

   FALLBACK
     If the key/Place ID are missing (local dev, deploy previews) or the
     fetch fails, we fall back to the last-known static aggregate below and
     render NO review cards, so the build never breaks.

   GOOGLE TERMS (Maps Platform Terms 3.2.3 "No Caching")
     Maps Content (ratings/reviews) may only be cached up to 30 days, then
     must be refreshed. So: (1) keep the scheduled rebuild running at least
     monthly; (2) NEVER persist fetched review text into the repo — it only
     ever lives in the throwaway `dist/` output. Reviews are shown with the
     required attribution (author + link back to Google).

   Localisation: en / fr / de copy is provided; `lu` falls back to `en`.
   Review text is fetched once in GOOGLE_PLACES_LANGUAGE (default en) and
   shown across all locales.
   ========================================================================= */

// Last-known static aggregate — used only as a fallback (see header).
const RATING = 4.5;
const COUNT = 69;

// Fallback outbound link when the live googleMapsUri isn't available.
const GOOGLE_URL =
  'https://www.google.com/maps/search/?api=1&query=Skydive%20Luxembourg%20Noertrange';

const SECTION = {
  en: {
    eyebrow: 'Reviews',
    title: 'Rated by real jumpers.',
    lead: 'Don’t just take our word for it — here’s how visitors rate their day at the dropzone.',
    countLabel: 'Google reviews',
    cta: 'Read our reviews on Google',
    starsLabel: 'Rated {n} out of 5',
    reviewsLabel: 'Recent reviews',
    attribution: 'Reviews from Google',
    reviewCta: 'View on Google',
  },
  fr: {
    eyebrow: 'Avis',
    title: 'Noté par de vrais parachutistes.',
    lead: 'Ne nous croyez pas sur parole — voici la note que les visiteurs donnent à leur journée sur la DZ.',
    countLabel: 'avis Google',
    cta: 'Lire nos avis sur Google',
    starsLabel: 'Noté {n} sur 5',
    reviewsLabel: 'Avis récents',
    attribution: 'Avis depuis Google',
    reviewCta: 'Voir sur Google',
  },
  de: {
    eyebrow: 'Bewertungen',
    title: 'Von echten Springern bewertet.',
    lead: 'Verlass dich nicht nur auf unser Wort — so bewerten Besucher ihren Tag auf der Dropzone.',
    countLabel: 'Google-Bewertungen',
    cta: 'Unsere Google-Bewertungen lesen',
    starsLabel: 'Bewertet mit {n} von 5',
    reviewsLabel: 'Neueste Bewertungen',
    attribution: 'Bewertungen von Google',
    reviewCta: 'Auf Google ansehen',
  },
};

// Read a build-time secret from either Astro/Vite's server env or Node's
// process.env — whichever Netlify populated. Never PUBLIC_-prefixed, so it
// stays server-side and is dropped from the client bundle.
function env(name) {
  const viteVal =
    typeof import.meta !== 'undefined' && import.meta.env
      ? import.meta.env[name]
      : undefined;
  return viteVal ?? (typeof process !== 'undefined' ? process.env?.[name] : undefined);
}

// Map a Places API (New) Review object to the shape the UI needs.
// Defensive: any missing field just yields undefined and is handled in the view.
function mapReview(r) {
  const author = r?.authorAttribution ?? {};
  const text = r?.text?.text ?? r?.originalText?.text ?? '';
  return {
    author: author.displayName ?? 'Google user',
    authorUrl: author.uri ?? null,
    photo: author.photoUri ?? null,
    rating: typeof r?.rating === 'number' ? r.rating : 5,
    relativeTime: r?.relativePublishTimeDescription ?? '',
    text: text.trim(),
    reviewUrl: r?.googleMapsUri ?? author.uri ?? null,
  };
}

// Fetch aggregate + reviews from Google. Returns null on any problem so the
// caller falls back to the static aggregate. Memoised: one network call per
// build regardless of how many pages/locales import this module.
let _placePromise;
async function fetchPlace() {
  const key = env('GOOGLE_PLACES_API_KEY');
  const placeId = env('GOOGLE_PLACE_ID');
  const language = env('GOOGLE_PLACES_LANGUAGE') || 'en';

  if (!key || !placeId) {
    console.warn(
      '[google-reviews] GOOGLE_PLACES_API_KEY / GOOGLE_PLACE_ID not set — using fallback aggregate, no review cards.',
    );
    return null;
  }

  try {
    const url =
      `https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}` +
      `?languageCode=${encodeURIComponent(language)}&regionCode=LU`;
    const res = await fetch(url, {
      headers: {
        'X-Goog-Api-Key': key,
        // Keep the field mask tight — it decides the billing SKU.
        'X-Goog-FieldMask': 'rating,userRatingCount,googleMapsUri,reviews',
      },
      signal: AbortSignal.timeout(10000),
    });

    if (!res.ok) {
      const body = await res.text().catch(() => '');
      console.warn(
        `[google-reviews] Places API returned ${res.status} — using fallback. ${body.slice(0, 300)}`,
      );
      return null;
    }

    const data = await res.json();
    const reviews = Array.isArray(data.reviews)
      ? data.reviews.map(mapReview).filter((r) => r.text.length > 0).slice(0, 5)
      : [];

    console.log(
      `[google-reviews] Fetched from Google: rating ${data.rating}, ` +
        `${data.userRatingCount} ratings, ${reviews.length} review card(s).`,
    );

    return {
      rating: typeof data.rating === 'number' ? data.rating : null,
      count: typeof data.userRatingCount === 'number' ? data.userRatingCount : null,
      url: data.googleMapsUri ?? null,
      reviews,
    };
  } catch (err) {
    console.warn(
      `[google-reviews] Fetch failed (${err?.name ?? 'error'}: ${err?.message ?? err}) — using fallback.`,
    );
    return null;
  }
}

function getPlace() {
  if (!_placePromise) _placePromise = fetchPlace();
  return _placePromise;
}

/**
 * Return the localized Google-rating block for a page.
 * Falls back to English copy for any locale without its own (e.g. `lu`), and
 * to the static aggregate (no cards) when live data isn't available.
 */
export async function getGoogleReviews(lang = 'en') {
  const section = SECTION[lang] ?? SECTION.en;
  const live = await getPlace();
  return {
    ...section,
    rating: live?.rating ?? RATING,
    count: live?.count ?? COUNT,
    url: live?.url ?? GOOGLE_URL,
    reviews: live?.reviews ?? [],
  };
}
