import type { ParsedUrlQuery } from 'querystring'

/**
 * A verdict from an old court website.
 * `id` is the island.is verdict id, when known. Otherwise the verdict is
 * looked up by `caseNumber` (and `verdictDate` if the case has several
 * verdicts) in `court` or the rule's courts.
 */
export type LegacyVerdict = {
  id?: string
  caseNumber?: string
  verdictDate?: string
  court?: string
}

/** Old verdict ids and the verdicts they stood for */
export type LegacyVerdictTable = Record<string, LegacyVerdict>

export type Rule = {
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

export type Route = {
  /** Lowercase paths, a :segment matches any single segment */
  paths: string[]
  rule: Rule
  /** Also match the site root with a verdict pageid query param */
  verdictPageAlias?: boolean
}
