// =====================================================================
// Deciding whether a stored link is safe to open (LOOP-278).
//
// `events.rsvp_url` and `events.event_url` are validated on
// POST /events/create but NOT in server/src/events/ingest.ts, so a scraped
// row can hold whatever a scraper's link regex picked up: a scheme-less host,
// a mailto:, an empty string, a fragment of prose. Two testers lost the app to
// exactly that -- tapping RSVP on an externally ticketed event froze it on
// iPhone and crashed it on iPad -- so the client has to treat every stored
// link as unverified before handing it to a browser.
//
// Lives in shared/ so the read guard and any future write-time normalisation
// agree on what counts as a web address, and so it can be tested (there is no
// client test runner; server/test picks up shared/).
//
// NOTE: no `new URL()`. React Native ships no WHATWG URL implementation and
// this repo pulls in no polyfill, so `URL` is a stub on Hermes -- using it
// would move the crash rather than fix it. Plain string work only, which also
// keeps this module dependency-free as shared/ requires.
// =====================================================================

/** Matches MAX_URL_LENGTH in server/src/routes/events.worker.ts. */
export const MAX_EXTERNAL_URL_LENGTH = 2048;

/** `scheme:` at the very start, per RFC 3986. */
const SCHEME = /^[a-z][a-z0-9+.-]*:/i;
const HTTP_SCHEME = /^https?:\/\//i;

/**
 * Coerce a stored link into something safe to hand a browser, or null if it
 * isn't a web address at all.
 *
 * Returns http(s) URLs only. A scheme-less value is read as a host and gets
 * `https://`, because that is the most common shape in the wild -- a creator
 * pastes "texasperformingarts.evenue.net" out of the address bar, and the
 * scrapers' link regexes yield the same -- and it is precisely the reported
 * crash case. Everything else is rejected here rather than at the point of
 * presentation:
 *
 *   - a non-http scheme (mailto:, tel:, an app scheme) -- SFSafariViewController
 *     raises on these rather than declining them
 *   - interior whitespace, which means the field holds a sentence
 *   - a hostless or undotted string, so we never open a browser on
 *     "https://rsvp" and call that a successful hand-off
 */
export function toExternalHttpUrl(raw: string | null | undefined): string | null {
  if (typeof raw !== 'string') return null;

  const trimmed = raw.trim();
  if (!trimmed || trimmed.length > MAX_EXTERNAL_URL_LENGTH) return null;

  // Leading/trailing space is a paste artefact and was trimmed above; space in
  // the middle is prose.
  if (/\s/.test(trimmed)) return null;

  const hasScheme = SCHEME.test(trimmed);
  if (hasScheme && !HTTP_SCHEME.test(trimmed)) return null;

  const candidate = hasScheme ? trimmed : `https://${trimmed}`;

  // The authority is everything between "//" and the first /, ?, or #. Drop
  // any userinfo before checking the host, so "user@host/path" still resolves.
  const authority = candidate.replace(HTTP_SCHEME, '').split(/[/?#]/)[0];
  const host = (authority.split('@').pop() ?? '').split(':')[0];
  if (!host || !host.includes('.') || host.startsWith('.') || host.endsWith('.')) return null;

  return candidate;
}
