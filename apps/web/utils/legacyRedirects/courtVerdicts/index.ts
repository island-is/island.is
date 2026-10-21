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

import type { LegacyRedirectHandler } from '../types'
import districtCourtVerdicts from './data/district.json'
import retrialCourtVerdicts from './data/endurupptokudomur.json'
import supremeCourtVerdicts from './data/haestirettur.json'
import courtOfAppealVerdicts from './data/landsrettur.json'

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
  fromQuery?: (query: ParsedUrlQuery) => LegacyVerdict | undefined
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

const GUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/

const getQueryValue = (query: ParsedUrlQuery, key: string) => {
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
  query: ParsedUrlQuery,
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

const findLegacyVerdict = (rule: Rule, query: ParsedUrlQuery) => {
  for (const { param, table } of rule.lookups ?? []) {
    const oldId = getQueryValue(query, param)
    if (oldId && table[oldId]) return table[oldId]
  }
  return rule.fromQuery?.(query)
}

const resolveVerdictId = async (
  rule: Rule,
  query: ParsedUrlQuery,
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

/** Page ids the old court websites (all on the same CMS) used for verdicts */
const LEGACY_VERDICT_PAGE_IDS = [
  '347c3bb1-8926-11e5-80c6-005056bc6a40',
  'd2ca19a6-a3fa-11e5-9402-005056bc0bdb',
]

type Route = {
  /** Lowercase paths, a :segment matches any single segment */
  paths: string[]
  rule: Rule
  /** Also match the site root with a verdict pageid query param */
  verdictPageAlias?: boolean
}

const DISTRICT_COURT_VERDICT_ROUTE: Route = {
  paths: ['/domar/domur', '/heradsdomstolar/:court/domar/domur'],
  rule: RULES.district.verdict,
  verdictPageAlias: true,
}

/** Old court website routes, by host (without www) */
const ROUTES: Record<string, Route[]> = {
  'landsrettur.is': [
    {
      paths: [
        '/domar-og-urskurdir/domur-urskurdur',
        '/domar-og-urskurdir/domur',
      ],
      rule: RULES.landsrettur.verdict,
      verdictPageAlias: true,
    },
    {
      paths: ['/domar-og-urskurdir/domur-urskurdur/$verdict/download'],
      rule: RULES.landsrettur.document,
    },
  ],
  'haestirettur.is': [
    {
      paths: ['/domar/domur', '/domar/_domur'],
      rule: RULES.haestirettur.verdict,
      verdictPageAlias: true,
    },
    {
      paths: [
        '/akvardanir/_malskotsbeidni',
        '/malskotsbeidnir/_malskotsbeidni',
      ],
      rule: RULES.haestirettur.determination,
    },
    { paths: ['/domar'], rule: RULES.haestirettur.nr },
    { paths: ['/ifx_hr'], rule: RULES.haestirettur.ifx },
  ],
  'heradsdomstolar.is': [DISTRICT_COURT_VERDICT_ROUTE],
  'domstolar.is': [
    DISTRICT_COURT_VERDICT_ROUTE,
    { paths: ['/domaleit/nanar'], rule: RULES.district.search },
  ],
  'endurupptokudomur.is': [
    {
      paths: ['/urskurdir/domur-urskurdur'],
      rule: RULES.endurupptokudomur.verdict,
      verdictPageAlias: true,
    },
  ],
}

const matchesPath = (pattern: string, path: string) => {
  const patternSegments = pattern.split('/')
  const pathSegments = path.split('/')
  return (
    patternSegments.length === pathSegments.length &&
    patternSegments.every(
      (segment, i) => segment.startsWith(':') || segment === pathSegments[i],
    )
  )
}

const isVerdictPageAlias = (path: string, query: ParsedUrlQuery) => {
  const pageId = getQueryValue(query, 'pageid')
  return (
    (path === '' || path === '/default.aspx') &&
    Boolean(pageId && LEGACY_VERDICT_PAGE_IDS.includes(pageId))
  )
}

const findRule = (host: string, path: string, query: ParsedUrlQuery) =>
  ROUTES[host]?.find(
    (route) =>
      route.paths.some((pattern) => matchesPath(pattern, path)) ||
      (route.verdictPageAlias && isVerdictPageAlias(path, query)),
  )?.rule

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
    if (oldId && GUID_REGEX.test(oldId)) {
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
