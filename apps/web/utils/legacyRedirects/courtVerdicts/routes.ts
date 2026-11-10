import type { ParsedUrlQuery } from 'querystring'

import districtCourtVerdicts from './data/district.json'
import retrialCourtVerdicts from './data/endurupptokudomur.json'
import supremeCourtVerdicts from './data/haestirettur.json'
import courtOfAppealVerdicts from './data/landsrettur.json'
import { getQueryValue } from './query'
import type { LegacyVerdict, Route, Rule } from './types'

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

/** Page ids the old court websites (all on the same CMS) used for verdicts */
const LEGACY_VERDICT_PAGE_IDS = [
  '347c3bb1-8926-11e5-80c6-005056bc6a40',
  'd2ca19a6-a3fa-11e5-9402-005056bc0bdb',
]

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
  courtOfAppeal: {
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
  supremeCourt: {
    verdict: {
      lookups: [{ param: 'id', table: supremeCourtVerdicts.verdict }],
      directPath: {
        param: 'id',
        path: (id) => `/domar/s-${id.toUpperCase()}`,
      },
      courts: [SUPREME_COURT],
      fallbackQuery: () => ({ court: SUPREME_COURT }),
    },
    determination: {
      lookups: [{ param: 'id', table: supremeCourtVerdicts.determination }],
      path: (id) => `/s/haestirettur/akvardanir/${id}`,
      directPath: {
        param: 'id',
        path: (id) => `/s/haestirettur/akvardanir/${id.toUpperCase()}`,
      },
      courts: [SUPREME_COURT],
      fallbackQuery: () => ({ court: SUPREME_COURT }),
    },
    number: {
      lookups: [{ param: 'nr', table: supremeCourtVerdicts.nr }],
      courts: [SUPREME_COURT],
      fallbackQuery: () => ({ court: SUPREME_COURT }),
    },
    ifxNumber: {
      lookups: [{ param: 'nr', table: supremeCourtVerdicts.ifxNr }],
      courts: [SUPREME_COURT],
      fallbackQuery: () => ({ court: SUPREME_COURT }),
    },
  },
  districtCourt: {
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
  retrialCourt: {
    verdict: {
      lookups: [{ param: 'id', table: retrialCourtVerdicts.id }],
      goproIdParam: 'id',
      courts: [RETRIAL_COURT],
      fallbackQuery: () => ({ court: RETRIAL_COURT }),
    },
  },
}

const DISTRICT_COURT_VERDICT_ROUTE: Route = {
  paths: ['/domar/domur', '/heradsdomstolar/:court/domar/domur'],
  rule: RULES.districtCourt.verdict,
  verdictPageAlias: true,
}

/** Old court website routes, by host (without www) */
export const ROUTES: Record<string, Route[]> = {
  'landsrettur.is': [
    {
      paths: [
        '/domar-og-urskurdir/domur-urskurdur',
        '/domar-og-urskurdir/domur',
      ],
      rule: RULES.courtOfAppeal.verdict,
      verdictPageAlias: true,
    },
    {
      paths: ['/domar-og-urskurdir/domur-urskurdur/$verdict/download'],
      rule: RULES.courtOfAppeal.document,
    },
  ],
  'haestirettur.is': [
    {
      paths: ['/domar/domur', '/domar/_domur'],
      rule: RULES.supremeCourt.verdict,
      verdictPageAlias: true,
    },
    {
      paths: [
        '/akvardanir/_malskotsbeidni',
        '/malskotsbeidnir/_malskotsbeidni',
      ],
      rule: RULES.supremeCourt.determination,
    },
    { paths: ['/domar'], rule: RULES.supremeCourt.number },
    { paths: ['/ifx_hr'], rule: RULES.supremeCourt.ifxNumber },
  ],
  'heradsdomstolar.is': [DISTRICT_COURT_VERDICT_ROUTE],
  'domstolar.is': [
    DISTRICT_COURT_VERDICT_ROUTE,
    { paths: ['/domaleit/nanar'], rule: RULES.districtCourt.search },
  ],
  'endurupptokudomur.is': [
    {
      paths: ['/urskurdir/domur-urskurdur'],
      rule: RULES.retrialCourt.verdict,
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

export const findRule = (
  host: string,
  path: string,
  query: ParsedUrlQuery,
): Rule | undefined =>
  ROUTES[host]?.find(
    (route) =>
      route.paths.some((pattern) => matchesPath(pattern, path)) ||
      (route.verdictPageAlias && isVerdictPageAlias(path, query)),
  )?.rule
