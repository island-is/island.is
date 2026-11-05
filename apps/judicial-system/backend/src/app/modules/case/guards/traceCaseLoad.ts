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

// Underscore, not hyphen: the Datadog agent normalises span names and turns a
// hyphen into an underscore, so this is the name a query has to use.
export const CASE_LOAD_SPAN = 'judicial_system.case_load'
export const CASE_LOAD_GUARD_TAG = 'case_load.guard'
export const CASE_LOAD_INCLUDE_TAG = 'case_load.include'
export const CASE_LOAD_ROUTE_TAG = 'case_load.route'

/**
 * The parts of the request the load is tagged with. Under Nest the route
 * pattern is on the request by the time a guard runs, since guards run inside
 * the route's handler.
 */
export interface CaseLoadRequest {
  method?: string
  route?: { path?: string }
  path?: string
}

export const caseLoadRoute = (request: CaseLoadRequest): string =>
  `${request.method ?? ''} ${request.route?.path ?? request.path ?? ''}`.trim()

/**
 * Runs a guard's case load inside a span of its own, named after the guard
 * and tagged with the include profile and the route being served.
 *
 * The span makes every Postgres query the load issues a child of it, so the
 * query volume and the time spent can be attributed to the guard that caused
 * them. The route tag is what splits that per route: the span active in a
 * guard is Nest's router middleware span, not the request entry span, so the
 * route cannot be read off a parent and has to be carried here. Together they
 * are what the guard migrations to narrower profiles are measured against.
 */
export const traceCaseLoad = <T>(
  guard: string,
  include: CaseLoadInclude,
  request: CaseLoadRequest,
  load: () => Promise<T>,
): Promise<T> =>
  tracer.trace(
    CASE_LOAD_SPAN,
    {
      resource: guard,
      tags: {
        [CASE_LOAD_GUARD_TAG]: guard,
        [CASE_LOAD_INCLUDE_TAG]: include,
        [CASE_LOAD_ROUTE_TAG]: caseLoadRoute(request),
      },
    },
    load,
  )
