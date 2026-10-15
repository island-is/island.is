import type { NextApiRequest, NextApiResponse } from 'next'

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
import districtCourtVerdicts from '@island.is/web/screens/Verdicts/legacyVerdictRedirects/district.json'
import retrialCourtVerdicts from '@island.is/web/screens/Verdicts/legacyVerdictRedirects/endurupptokudomur.json'
import supremeCourtVerdicts from '@island.is/web/screens/Verdicts/legacyVerdictRedirects/haestirettur.json'
import courtOfAppealVerdicts from '@island.is/web/screens/Verdicts/legacyVerdictRedirects/landsrettur.json'

/**
 * A verdict from an old court website.
 * `id` is the island.is verdict id, when known. Otherwise the verdict is
 * looked up by `caseNumber` (and `verdictDate` if the case has several
 * verdicts) in `court` or the rule's courts.
 */
type LegacyVerdict = {
  id?: string
  caseNumber?: string
  verdictDate?: string
  court?: string
}

type LegacyVerdictTable = Record<string, LegacyVerdict>

type Rule = {
  /** Query params to look up in legacy verdict tables, in order */
  lookups?: { param: string; table: LegacyVerdictTable }[]
  /** Old ids that may still be valid GoPro ids (g-{id}) */
  goproIdParam?: string
  /** Old ids that map directly to an island.is path */
  directPath?: { param: string; path: (id: string) => string }
  /** Legacy verdict that can be read from the url itself */
  fromQuery?: (query: NextApiRequest['query']) => LegacyVerdict | undefined
  /** Courts to look case numbers up in, unless the legacy verdict has one */
  courts: string[]
  /** Verdict list query params to fall back to */
  fallbackQuery: (verdict?: LegacyVerdict) => Record<string, string>
}

const COURT_OF_APPEAL = 'landsrettur'
const SUPREME_COURT = 'Hæstiréttur'
const RETRIAL_COURT = 'Endurupptokudomur'
const ALL_DISTRICT_COURTS = 'Héraðsdómstólar'
const DISTRICT_COURTS = [
  'hd-reykjavik',
  'hd-vesturland',
  'hd-vestfirdir',
  'hd-nordurland-vestra',
  'hd-nordurland-eystra',
  'hd-austurland',
  'hd-sudurland',
  'hd-reykjanes',
]

const GUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/

const getQueryValue = (query: NextApiRequest['query'], key: string) => {
  const matchingKey = Object.keys(query).find(
    (k) => k.toLowerCase() === key.toLowerCase(),
  )
  const value = matchingKey ? query[matchingKey] : undefined
  return (Array.isArray(value) ? value[0] : value)?.trim().toLowerCase()
}

const districtCourtFallback = (
  verdict?: LegacyVerdict,
): Record<string, string> =>
  verdict?.court
    ? { districtCourts: verdict.court }
    : { court: ALL_DISTRICT_COURTS }

/** Old district court search ids, e.g. E200500321 -> E-321/2005 */
const parseDistrictCourtSearchId = (
  query: NextApiRequest['query'],
): LegacyVerdict | undefined => {
  const match = getQueryValue(query, 'id')?.match(/^([a-z])(\d{4})(\d{5})$/)
  if (!match) return undefined
  const [, caseType, year, caseNumber] = match
  return {
    caseNumber: `${caseType.toUpperCase()}-${Number(caseNumber)}/${year}`,
  }
}

const RULES: Record<string, Record<string, Rule>> = {
  landsrettur: {
    verdict: {
      lookups: [
        { param: 'verdictid', table: courtOfAppealVerdicts.verdictId },
        { param: 'id', table: courtOfAppealVerdicts.caseId },
      ],
      courts: [COURT_OF_APPEAL],
      fallbackQuery: () => ({ court: COURT_OF_APPEAL }),
    },
    document: {
      lookups: [{ param: 'docid', table: courtOfAppealVerdicts.documentId }],
      courts: [COURT_OF_APPEAL],
      fallbackQuery: () => ({ court: COURT_OF_APPEAL }),
    },
  },
  haestirettur: {
    verdict: {
      directPath: {
        param: 'id',
        path: (id) => `/domar/s-${id.toUpperCase()}`,
      },
      courts: [SUPREME_COURT],
      fallbackQuery: () => ({ court: SUPREME_COURT }),
    },
    determination: {
      directPath: {
        param: 'id',
        path: (id) => `/s/haestirettur/akvardanir/${id.toUpperCase()}`,
      },
      courts: [SUPREME_COURT],
      fallbackQuery: () => ({ court: SUPREME_COURT }),
    },
    nr: {
      lookups: [{ param: 'nr', table: supremeCourtVerdicts.nr }],
      courts: [SUPREME_COURT],
      fallbackQuery: () => ({ court: SUPREME_COURT }),
    },
    ifx: {
      lookups: [{ param: 'nr', table: supremeCourtVerdicts.ifxNr }],
      courts: [SUPREME_COURT],
      fallbackQuery: () => ({ court: SUPREME_COURT }),
    },
  },
  district: {
    verdict: {
      lookups: [{ param: 'id', table: districtCourtVerdicts.id }],
      goproIdParam: 'id',
      courts: DISTRICT_COURTS,
      fallbackQuery: districtCourtFallback,
    },
    search: {
      fromQuery: parseDistrictCourtSearchId,
      courts: DISTRICT_COURTS,
      fallbackQuery: districtCourtFallback,
    },
  },
  endurupptokudomur: {
    verdict: {
      lookups: [{ param: 'id', table: retrialCourtVerdicts.id }],
      goproIdParam: 'id',
      courts: [RETRIAL_COURT],
      fallbackQuery: () => ({ court: RETRIAL_COURT }),
    },
  },
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

  const candidates = (response.data?.webVerdicts?.items ?? []).filter(
    (item) => item.caseNumber === caseNumber,
  )
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

const findLegacyVerdict = (rule: Rule, query: NextApiRequest['query']) => {
  for (const { param, table } of rule.lookups ?? []) {
    const oldId = getQueryValue(query, param)
    if (oldId && table[oldId]) return table[oldId]
  }
  return rule.fromQuery?.(query)
}

const resolveVerdictId = async (
  rule: Rule,
  query: NextApiRequest['query'],
  verdict?: LegacyVerdict,
) => {
  if (verdict?.id) return verdict.id
  try {
    if (verdict) {
      const id = await findVerdictIdByCaseNumber(verdict, rule.courts)
      if (id) return id
    }
    const oldId = rule.goproIdParam
      ? getQueryValue(query, rule.goproIdParam)
      : undefined
    if (oldId && GUID_REGEX.test(oldId)) {
      const goproId = `g-${oldId}`
      if (await goproVerdictExists(goproId)) return goproId
    }
  } catch {
    // Fall through to the verdict list
  }
  return null
}

/**
 * Redirects verdict urls from old court websites (landsrettur.is,
 * haestirettur.is, heradsdomstolar.is, domstolar.is, endurupptokudomur.is)
 * to the corresponding verdict on island.is.
 * The `site` and `kind` query params are set by the rewrites in next.config.js.
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const site = getQueryValue(req.query, 'site') ?? ''
  const kind = getQueryValue(req.query, 'kind') ?? ''
  const rule = RULES[site]?.[kind]

  if (!rule) {
    return res.redirect(302, '/domar')
  }

  if (rule.directPath) {
    const oldId = getQueryValue(req.query, rule.directPath.param)
    if (oldId && GUID_REGEX.test(oldId)) {
      return res.redirect(301, rule.directPath.path(oldId))
    }
  }

  const verdict = findLegacyVerdict(rule, req.query)
  const newId = await resolveVerdictId(rule, req.query, verdict)

  if (newId) {
    return res.redirect(301, `/domar/${newId}`)
  }

  const params = new URLSearchParams(rule.fallbackQuery(verdict))
  if (verdict?.caseNumber) {
    params.set('number', verdict.caseNumber)
  }
  return res.redirect(302, `/domar?${params.toString()}`)
}
