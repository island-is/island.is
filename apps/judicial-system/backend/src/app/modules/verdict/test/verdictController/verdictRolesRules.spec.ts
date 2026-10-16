import { RolesRule } from '@island.is/judicial-system/auth'

import { VerdictController } from '../../verdict.controller'

// The controller puts RolesGuard at class level, ahead of the route-level
// CaseExistsForUpdateGuard on createVerdicts, update and deliverCaseVerdict,
// so a caller in a role the route has no rule for is rejected before a write
// lock is taken on the case row. That ordering is only safe while no rule on
// those routes needs the case: a RolesRule may carry a canActivate that reads
// request.case, and prosecutorTransitionRule on the transition route denies
// outright when it is missing - which is why that route has to read the case
// first and pays for it with RouteRolesGuard.
//
// Nothing about a rule's declaration says which kind it is, so adding a
// case-reading rule to one of these routes would silently turn it into a 403
// and recreate the lock exposure at the same time. This pins the assumption
// to each route's own metadata rather than to a list retyped in a spec.
describe.each(['createVerdicts', 'update', 'deliverCaseVerdict'])(
  'VerdictController - %s rules',
  (methodName) => {
    const rules: RolesRule[] =
      Reflect.getMetadata(
        'roles-rules',
        VerdictController.prototype[methodName as keyof VerdictController],
      ) ?? []

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
  },
)
