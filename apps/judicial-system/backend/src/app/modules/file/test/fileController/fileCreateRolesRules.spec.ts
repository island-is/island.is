import { RolesRule } from '@island.is/judicial-system/auth'

import { FileController } from '../../file.controller'

// The three routes that create a file put RolesGuard ahead of
// CaseExistsForUpdateGuard, so a caller in a role the route has no rule for is
// rejected before a write lock is taken on the case row. That ordering is only
// safe while no rule on these routes needs the case: a RolesRule may carry a
// canActivate that reads request.case, and with RolesGuard first such a rule
// would decide against a case that has not been read yet.
//
// Nothing about a rule's declaration says which kind it is, so adding a
// case-reading rule to one of these routes would silently turn it into a 403.
// This pins the assumption to each route's own metadata rather than to a list
// retyped in a spec. A route that needs such a rule has to read the case
// first, with RouteRolesGuard ahead of the read.
describe.each([
  'createCaseFile',
  'createDefendantCaseFile',
  'createCivilClaimantCaseFile',
] as const)('FileController - %s rules', (methodName) => {
  const rules: RolesRule[] =
    Reflect.getMetadata('roles-rules', FileController.prototype[methodName]) ??
    []

  it('should declare rules at all', () => {
    expect(rules.length).toBeGreaterThan(0)
  })

  it('should decide every rule on the user alone, without reading the case', () => {
    rules.forEach((rule) => {
      // A bare UserRole is a string and has nowhere to put a canActivate; the
      // object forms may define one, and these routes' must not.
      expect(typeof rule === 'string' || rule.canActivate === undefined).toBe(
        true,
      )
    })
  })
})
