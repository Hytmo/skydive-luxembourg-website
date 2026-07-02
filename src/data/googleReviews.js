/* =========================================================================
   Skydive Luxembourg - Google rating (social proof)
   -------------------------------------------------------------------------
   REAL, verifiable aggregate rating — not invented content.

   Source: public Google reviews for Skydive Luxembourg (Noertrange),
   read via top-rated.online, as of July 2026. These figures drift over time —
   refresh RATING / COUNT periodically (or ask the club for the current numbers).

   No individual review text or author names are stored: Google's per-review
   text/authors are not reliably available to embed verbatim, and inventing
   quotes is not an option. Instead we show the true aggregate and link out to
   Google so visitors read the real reviews at the source.

   Localisation note: en / fr / de are provided; `lu` (currently disabled)
   falls back to `en`.
   ========================================================================= */

const RATING = 4.5;
const COUNT = 69;

// Google listing (Maps). This query URL reliably lands on the business.
// Swap in the exact Google place/reviews URL here if you have it.
const GOOGLE_URL = 'https://www.google.com/maps/search/?api=1&query=Skydive%20Luxembourg%20Noertrange';

const SECTION = {
  en: {
    eyebrow: 'Reviews',
    title: 'Rated by real jumpers.',
    lead: 'Don’t just take our word for it — here’s how visitors rate their day at the dropzone.',
    countLabel: 'Google reviews',
    cta: 'Read our reviews on Google',
    starsLabel: 'Rated {n} out of 5',
  },
  fr: {
    eyebrow: 'Avis',
    title: 'Noté par de vrais parachutistes.',
    lead: 'Ne nous croyez pas sur parole — voici la note que les visiteurs donnent à leur journée sur la DZ.',
    countLabel: 'avis Google',
    cta: 'Lire nos avis sur Google',
    starsLabel: 'Noté {n} sur 5',
  },
  de: {
    eyebrow: 'Bewertungen',
    title: 'Von echten Springern bewertet.',
    lead: 'Verlass dich nicht nur auf unser Wort — so bewerten Besucher ihren Tag auf der Dropzone.',
    countLabel: 'Google-Bewertungen',
    cta: 'Unsere Google-Bewertungen lesen',
    starsLabel: 'Bewertet mit {n} von 5',
  },
};

/**
 * Return the localized Google-rating block for a page.
 * Falls back to English for any locale without its own copy (e.g. `lu`).
 */
export function getGoogleReviews(lang = 'en') {
  const section = SECTION[lang] ?? SECTION.en;
  return { ...section, rating: RATING, count: COUNT, url: GOOGLE_URL };
}
