// TEMPORARY diagnostic endpoint — surfaces why the Google reviews fetch is
// falling back, without exposing the API key. Delete after diagnosing.
export const prerender = true;

function env(name) {
  const viteVal =
    typeof import.meta !== 'undefined' && import.meta.env
      ? import.meta.env[name]
      : undefined;
  return viteVal ?? (typeof process !== 'undefined' ? process.env?.[name] : undefined);
}

export async function GET() {
  const key = env('GOOGLE_PLACES_API_KEY');
  const placeId = env('GOOGLE_PLACE_ID');

  const out = {
    builtAt: 'build-time',
    probe: 'v2-post-key-fix',
    hasKey: !!key,
    keyLength: key ? String(key).length : 0,
    hasPlaceId: !!placeId,
    placeIdSample: placeId ? String(placeId).slice(0, 10) + '…' : null,
  };

  if (key && placeId) {
    try {
      const res = await fetch(
        `https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}?languageCode=en&regionCode=LU`,
        {
          headers: {
            'X-Goog-Api-Key': key,
            'X-Goog-FieldMask': 'rating,userRatingCount',
          },
          signal: AbortSignal.timeout(10000),
        },
      );
      out.httpStatus = res.status;
      const body = await res.text();
      // Google's error bodies name the exact problem (API not enabled, key
      // restriction, billing, bad place id). Trim to keep it small.
      out.responseBody = body.slice(0, 800);
    } catch (e) {
      out.fetchError = `${e?.name ?? 'error'}: ${e?.message ?? e}`;
    }
  }

  return new Response(JSON.stringify(out, null, 2), {
    headers: { 'content-type': 'application/json' },
  });
}
