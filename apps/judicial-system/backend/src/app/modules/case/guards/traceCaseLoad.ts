import tracer from 'dd-trace'

/**
 * The include profile a guard loads the case with. `case` is the full
 * aggregate (`caseInclude`), `limitedAccess` the defender's view of it,
 * `defendantIndictment` the indictment narrowed to one defendant, and
 * `minimal` the case row alone. A guard that loads with a new profile names
 * it here, so that the profile shows up in the breakdown below.
 */
export type CaseLoadInclude =
  | 'case'
  | 'limitedAccess'
  | 'defendantIndictment'
  | 'minimal'

export const CASE_LOAD_SPAN = 'judicial-system.case_load'
export const CASE_LOAD_GUARD_TAG = 'case_load.guard'
export const CASE_LOAD_INCLUDE_TAG = 'case_load.include'

/**
 * Runs a guard's case load inside a span of its own, named after the guard
 * and tagged with the include profile, and puts the same two tags on the
 * request span.
 *
 * The span makes every Postgres query the load issues a child of it, so the
 * query volume can be attributed to the guard that caused it. The tags on the
 * request span let request-level metrics (hits, latency, response size) be
 * split by which guard loaded the case and with which profile, route by
 * route. Both are what the guard migrations to narrower profiles are measured
 * against.
 */
export const traceCaseLoad = <T>(
  guard: string,
  include: CaseLoadInclude,
  load: () => Promise<T>,
): Promise<T> => {
  const tags = {
    [CASE_LOAD_GUARD_TAG]: guard,
    [CASE_LOAD_INCLUDE_TAG]: include,
  }

  tracer.scope().active()?.addTags(tags)

  return tracer.trace(CASE_LOAD_SPAN, { resource: guard, tags }, load)
}
