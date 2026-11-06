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
const LOOKUP_TIMEOUT_MS = 3000

/** Resolves to null when the lookup fails or takes too long */
const withTimeout = async <T>(lookup: () => Promise<T>): Promise<T | null> => {
  let timer: ReturnType<typeof setTimeout> | undefined
  const timeout = new Promise<null>((resolve) => {
    timer = setTimeout(() => resolve(null), LOOKUP_TIMEOUT_MS)
  })
  try {
    return await Promise.race([lookup(), timeout])
  } catch {
    return null
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

const findVerdictIdByCaseNumber = async (
  { caseNumber, verdictDate, court }: LegacyVerdict,
  courts: string[],
) => {
  if (!caseNumber) return null

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
  if ((response.data?.webVerdicts?.total ?? 0) > items.length) return null

  const candidates = items.filter((item) => item.caseNumber === caseNumber)
  if (candidates.length === 1) return candidates[0].id

  // verdictDate is typed as Date but arrives as an ISO string
  const sameDay = candidates.filter(
    (item) =>
      verdictDate &&
      item.verdictDate &&
      new Date(item.verdictDate).toISOString().startsWith(verdictDate),
  )
  return sameDay.length === 1 ? sameDay[0].id : null
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

/**
 * Resolves the island.is verdict id, from the legacy verdict if it is known,
 * otherwise from the case number or an old id that is still a GoPro id.
 * Returns null when no verdict is found.
 */
export const resolveVerdictId = async (
  rule: Rule,
  query: ParsedUrlQuery,
  verdict?: LegacyVerdict,
) => {
  if (verdict?.id) return verdict.id

  if (verdict) {
    const id = await withTimeout(() =>
      findVerdictIdByCaseNumber(verdict, rule.courts),
    )
    if (id) return id
  }

  const oldId = rule.goproIdParam
    ? getQueryValue(query, rule.goproIdParam)
    : undefined
  if (oldId && isGuid(oldId)) {
    const goproId = `g-${oldId}`
    if (await withTimeout(() => goproVerdictExists(goproId))) return goproId
  }

  return null
}
