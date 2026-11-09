import type { ParsedUrlQuery } from 'querystring'

import initApollo from '@island.is/web/graphql/client'
import {
  GetVerdictExistsQuery,
  GetVerdictExistsQueryVariables,
  GetVerdictsQuery,
  GetVerdictsQueryVariables,
} from '@island.is/web/graphql/schema'
import {
  GET_VERDICT_EXISTS_QUERY,
  GET_VERDICTS_QUERY,
} from '@island.is/web/screens/queries/Verdicts'

import { getQueryValue, isGuid } from './query'
import type { LegacyVerdict, Rule } from './types'

/** The server-side API client has no timeout, so bound each lookup */
const LOOKUP_TIMEOUT_MS = 10000

const TIMED_OUT = Symbol('timed out')

/** Throws when the lookup fails or takes too long */
const withTimeout = async <T>(lookup: () => Promise<T>): Promise<T> => {
  let timer: ReturnType<typeof setTimeout> | undefined
  const timeout = new Promise<typeof TIMED_OUT>((resolve) => {
    timer = setTimeout(() => resolve(TIMED_OUT), LOOKUP_TIMEOUT_MS)
  })
  try {
    const result = await Promise.race([lookup(), timeout])
    if (result === TIMED_OUT) throw new Error('Verdict lookup timed out')
    return result
  } finally {
    clearTimeout(timer)
  }
}

const goproVerdictExists = async (id: string) => {
  const apolloClient = initApollo({}, 'is')
  const response = await apolloClient.query<
    GetVerdictExistsQuery,
    GetVerdictExistsQueryVariables
  >({
    query: GET_VERDICT_EXISTS_QUERY,
    variables: { input: { id } },
  })
  return Boolean(response.data?.webVerdictById?.item)
}

type CaseNumberMatch = { id: string } | 'ambiguous' | 'none'

const findVerdictIdByCaseNumber = async (
  { caseNumber, verdictDate, court }: LegacyVerdict,
  courts: string[],
): Promise<CaseNumberMatch> => {
  if (!caseNumber) return 'none'

  const apolloClient = initApollo({}, 'is')
  const response = await apolloClient.query<
    GetVerdictsQuery,
    GetVerdictsQueryVariables
  >({
    query: GET_VERDICTS_QUERY,
    variables: {
      input: { page: 1, court: court ? [court] : courts, caseNumber },
    },
  })

  const items = response.data?.webVerdicts?.items ?? []
  // The right verdict may be on a later page, so only pick from a full list
  if ((response.data?.webVerdicts?.total ?? 0) > items.length)
    return 'ambiguous'

  const candidates = items.filter((item) => item.caseNumber === caseNumber)
  if (candidates.length === 0) return 'none'
  if (candidates.length === 1) return { id: candidates[0].id }

  // verdictDate is typed as Date but arrives as an ISO string
  const sameDay = candidates.filter(
    (item) =>
      verdictDate &&
      item.verdictDate &&
      new Date(item.verdictDate).toISOString().startsWith(verdictDate),
  )
  return sameDay.length === 1 ? { id: sameDay[0].id } : 'ambiguous'
}

/** Finds the verdict an old id in the url stood for */
export const findLegacyVerdict = (
  rule: Rule,
  query: ParsedUrlQuery,
): LegacyVerdict | undefined => {
  for (const { param, table } of rule.lookups ?? []) {
    const oldId = getQueryValue(query, param)
    if (oldId && Object.hasOwn(table, oldId)) return table[oldId]
  }
  return rule.fromQuery?.(query)
}

/** Whether the url has an old verdict id, as opposed to linking to a verdict list */
export const hasOldId = (rule: Rule, query: ParsedUrlQuery) =>
  [
    ...(rule.lookups ?? []).map(({ param }) => param),
    rule.goproIdParam,
    rule.directPath?.param,
  ].some((param) => param && getQueryValue(query, param))

export type VerdictIdResult =
  | { status: 'found'; id: string }
  /** Several verdicts have the case number and we can't tell which one */
  | { status: 'ambiguous' }
  | { status: 'notFound' }
  /** A lookup failed or timed out, so the verdict may still exist */
  | { status: 'failed' }

/**
 * Resolves the island.is verdict id, from the legacy verdict if it is known,
 * otherwise from the case number or an old id that is still a GoPro id.
 */
export const resolveVerdictId = async (
  rule: Rule,
  query: ParsedUrlQuery,
  verdict?: LegacyVerdict,
): Promise<VerdictIdResult> => {
  if (verdict?.id) return { status: 'found', id: verdict.id }

  let failed = false
  let ambiguous = false

  if (verdict) {
    try {
      const match = await withTimeout(() =>
        findVerdictIdByCaseNumber(verdict, rule.courts),
      )
      if (typeof match === 'object') return { status: 'found', id: match.id }
      ambiguous = match === 'ambiguous'
    } catch {
      failed = true
    }
  }

  const oldId = rule.goproIdParam
    ? getQueryValue(query, rule.goproIdParam)
    : undefined
  if (oldId && isGuid(oldId)) {
    const goproId = `g-${oldId}`
    try {
      if (await withTimeout(() => goproVerdictExists(goproId))) {
        return { status: 'found', id: goproId }
      }
    } catch {
      failed = true
    }
  }

  if (ambiguous) return { status: 'ambiguous' }
  return { status: failed ? 'failed' : 'notFound' }
}
