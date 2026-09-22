import { RolesRule } from '@island.is/judicial-system/auth'

import { CaseController } from '../../case.controller'

// The split route puts RolesGuard ahead of CaseExistsForUpdateGuard, so a
// caller in a role the route has no rule for is rejected before a write lock
// is taken on the case row. That ordering is only safe while no rule on the
// route needs the case: a RolesRule may carry a canActivate that reads
// request.case, and prosecutorTransitionRule on the transition route denies
// outright when it is missing - which is why that route has to read the case
// first and pays for it with RouteRolesGuard.
//
// Nothing about a rule's declaration says which kind it is, so adding a
// case-reading rule here would silently turn every split into a 403 and
// recreate the lock exposure at the same time. This pins the assumption to
// the route's own metadata rather than to a list retyped in a spec.
describe('CaseController - Split defendant from case rules', () => {
  const rules: RolesRule[] =
    Reflect.getMetadata(
      'roles-rules',
      CaseController.prototype.splitDefendantFromCase,
    ) ?? []

  it('should declare rules at all', () => {
    expect(rules.length).toBeGreaterThan(0)
  })

  it('should decide every rule on the user alone, without reading the case', () => {
    rules.forEach((rule) => {
      // A bare UserRole is a string and has nowhere to put a canActivate; the
      // object forms may define one, and this route's must not.
      expect(typeof rule === 'string' || rule.canActivate === undefined).toBe(
        true,
      )
    })
  })
})
