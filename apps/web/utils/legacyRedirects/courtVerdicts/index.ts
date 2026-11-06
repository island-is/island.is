import type { LegacyRedirectHandler } from '../types'
import { findLegacyVerdict, resolveVerdictId } from './lookup'
import { getQueryValue, isGuid } from './query'
import { findRule, ROUTES } from './routes'

/**
 * Redirects verdict urls from old court websites to the corresponding
 * verdict on island.is, or to the verdict list if it can't be found.
 */
const courtVerdictRedirect: LegacyRedirectHandler = async ({
  host,
  path,
  query,
}) => {
  const rule = findRule(host, path, query)
  if (!rule) return null

  if (rule.directPath) {
    const oldId = getQueryValue(query, rule.directPath.param)
    if (oldId && isGuid(oldId)) {
      return { destination: rule.directPath.path(oldId), permanent: true }
    }
  }

  const verdict = findLegacyVerdict(rule, query)
  const newId = await resolveVerdictId(rule, query, verdict)

  if (newId) {
    return { destination: `/domar/${newId}`, permanent: true }
  }

  const params = new URLSearchParams(rule.fallbackQuery(verdict))
  if (verdict?.caseNumber) {
    params.set('number', verdict.caseNumber)
  }
  return { destination: `/domar?${params.toString()}`, permanent: false }
}

export const courtVerdictRedirects: Record<string, LegacyRedirectHandler> =
  Object.fromEntries(
    Object.keys(ROUTES).map((host) => [host, courtVerdictRedirect]),
  )
