import type { ParsedUrlQuery } from 'querystring'

/** A url from an old website, as island.is/redirects/<host>/<path> */
export type LegacyRedirectRequest = {
  /** Lowercase host without www, e.g. landsrettur.is */
  host: string
  /** Lowercase path without a trailing slash, e.g. /domar/domur ('' for the root) */
  path: string
  query: ParsedUrlQuery
}

export type LegacyRedirect = {
  destination: string
  permanent: boolean
}

/** Returns null when the url isn't handled, so it falls through to the CMS redirects */
export type LegacyRedirectHandler = (
  request: LegacyRedirectRequest,
) => Promise<LegacyRedirect | null>
