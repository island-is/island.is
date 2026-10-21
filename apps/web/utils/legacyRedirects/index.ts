import type { ParsedUrlQuery } from 'querystring'

import { courtVerdictRedirects } from './courtVerdicts'
import type { LegacyRedirect, LegacyRedirectHandler } from './types'

/** Custom redirect handlers for old websites, by host (without www) */
const HANDLERS: Record<string, LegacyRedirectHandler> = {
  ...courtVerdictRedirects,
}

/**
 * Resolves island.is/redirects/<host>/<path> with the handler registered for
 * the host. Returns null when no handler takes the url.
 */
export const resolveLegacyRedirect = async (
  slug: string[],
  query: ParsedUrlQuery,
): Promise<LegacyRedirect | null> => {
  const [rawHost = '', ...pathSegments] = slug
  const host = rawHost.toLowerCase().replace(/^www\./, '')
  const handler = HANDLERS[host]
  if (!handler) return null

  const path = pathSegments.length
    ? `/${pathSegments.join('/').toLowerCase()}`
    : ''
  return handler({ host, path, query })
}
