import { RolesRule } from '@island.is/judicial-system/auth'

import { AppealStatementController } from '../appealStatement.controller'
import { AppealStatementDeadlineController } from '../appealStatementDeadline.controller'

// Both controllers put RolesGuard ahead of CaseExistsForUpdateGuard at class
// level, so a caller in a role the route has no rule for is rejected before a
// write lock is taken on the case row. That ordering is only safe while no
// rule needs the case: a RolesRule may carry a canActivate that reads
// request.case, and nothing about a rule's declaration says which kind it is.
// This pins the assumption to the routes' own metadata.
describe.each([
  [
    'AppealStatementDeadlineController - set',
    AppealStatementDeadlineController.prototype.set,
  ],
  [
    'AppealStatementController - fileStatement',
    AppealStatementController.prototype.fileStatement,
  ],
])('%s rules', (_name, handler) => {
  const rules: RolesRule[] = Reflect.getMetadata('roles-rules', handler) ?? []

  it('should declare rules at all', () => {
    expect(rules.length).toBeGreaterThan(0)
  })

  it('should decide every rule on the user alone, without reading the case', () => {
    rules.forEach((rule) => {
      // A bare UserRole is a string and has nowhere to put a canActivate;
      // the object forms may define one, and these controllers' must not.
      expect(typeof rule === 'string' || rule.canActivate === undefined).toBe(
        true,
      )
    })
  })
})
