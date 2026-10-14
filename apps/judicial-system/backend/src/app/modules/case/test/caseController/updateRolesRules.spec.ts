import { RolesRule } from '@island.is/judicial-system/auth'

import { CaseController } from '../../case.controller'

// The update route puts RolesGuard ahead of CaseExistsForUpdateGuard, so a
// caller in a role the route has no rule for - or one sending a field their
// rule does not allow - is rejected before a write lock is taken on the case
// row. That ordering is only safe while no rule on the route needs the case: a
// RolesRule may carry a canActivate that reads request.case, and
// prosecutorTransitionRule on the transition route denies outright when it is
// missing - which is why that route has to read the case first and pays for it
// with RouteRolesGuard.
//
// Nothing about a rule's declaration says which kind it is, so adding a
// case-reading rule here would silently turn every update by that role into a
// 403 and recreate the lock exposure at the same time. This pins the
// assumption to the route's own metadata rather than to a list retyped in a
// spec.
describe('CaseController - Update rules', () => {
  const rules: RolesRule[] =
    Reflect.getMetadata('roles-rules', CaseController.prototype.update) ?? []

  it('should declare rules at all', () => {
    expect(rules.length).toBeGreaterThan(0)
  })

  it('should decide every rule on the user and the body alone, without reading the case', () => {
    rules.forEach((rule) => {
      // A bare UserRole is a string and has nowhere to put a canActivate; the
      // object forms may define one, and this route's must not.
      expect(typeof rule === 'string' || rule.canActivate === undefined).toBe(
        true,
      )
    })
  })
})
