import type { LegacyRedirectHandler } from '../types'
import { findLegacyVerdict, hasOldId, resolveVerdictId } from './lookup'
import { getQueryValue, isGuid } from './query'
import { findRule, ROUTES } from './routes'

/**
 * Redirects verdict urls from old court websites to the corresponding
 * verdict on island.is. Urls without an old id go to the verdict list, and
 * old ids that can't be found are not found.
 */
const courtVerdictRedirect: LegacyRedirectHandler = async ({
  host,
  path,
  query,
}) => {
  const rule = findRule(host, path, query)
  if (!rule) return null

  const toPath = rule.path ?? ((id: string) => `/domar/${id}`)
  const verdict = findLegacyVerdict(rule, query)

  // Ids that changed on island.is are listed in the lookups
  if (verdict?.id) {
    return { destination: toPath(verdict.id), permanent: false }
  }

  // Known verdicts without an island.is id are looked up by case number instead
  if (rule.directPath && !verdict) {
    const oldId = getQueryValue(query, rule.directPath.param)
    if (oldId && isGuid(oldId)) {
      return { destination: rule.directPath.path(oldId), permanent: false }
    }
  }

  const verdictList = (caseNumber?: string) => {
    const params = new URLSearchParams(rule.fallbackQuery(verdict))
    if (caseNumber) params.set('number', caseNumber)
    return { destination: `/domar?${params.toString()}`, permanent: false }
  }

  // Links to the old verdict lists rather than a verdict
  if (!verdict && !hasOldId(rule, query)) {
    return verdictList()
  }

  const result = await resolveVerdictId(rule, query, verdict)
  switch (result.status) {
    case 'found':
      return { destination: toPath(result.id), permanent: false }
    case 'ambiguous':
      return verdictList(verdict?.caseNumber)
    case 'failed':
      return { unavailable: true }
    case 'notFound':
      return { notFound: true }
  }
}

export const courtVerdictRedirects: Record<string, LegacyRedirectHandler> =
  Object.fromEntries(
    Object.keys(ROUTES).map((host) => [host, courtVerdictRedirect]),
  )
