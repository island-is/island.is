import { RolesRule } from '@island.is/judicial-system/auth'

import { LimitedAccessAppealCaseController } from '../limitedAccessAppealCase.controller'

// The three routes that lock the case row put RolesGuard after
// LimitedAccessCaseExistsForUpdateGuard, and RouteRolesGuard ahead of it, on
// the assumption that a rule on one of them reads request.case: the
// defender's transition rule carries a canActivate that decides whether the
// defender appealed the appeal case being withdrawn. Were every rule a bare
// role, RolesGuard alone could run first and the pre-filter would be
// redundant; were the pre-filter to go, every authenticated caller would
// take a write lock until RolesGuard rejected them. Nothing about a rule's
// declaration says which kind it is, so this pins the assumption to each
// route's own metadata. limitedAccessAppealCaseGuardChain.spec.ts runs the
// resulting order.
const rulesOf = (methodName: string): RolesRule[] =>
  Reflect.getMetadata(
    'roles-rules',
    LimitedAccessAppealCaseController.prototype[
      methodName as keyof LimitedAccessAppealCaseController
    ],
  ) ?? []

const readsTheCase = (rule: RolesRule) =>
  typeof rule !== 'string' && rule.canActivate !== undefined

describe.each(['create', 'createEventLog', 'transition'])(
  'LimitedAccessAppealCaseController - %s rules',
  (methodName) => {
    it('should declare rules at all', () => {
      expect(rulesOf(methodName).length).toBeGreaterThan(0)
    })
  },
)

describe('LimitedAccessAppealCaseController - transition rules', () => {
  it('should decide from the case, which is why RolesGuard runs after the locking read', () => {
    expect(rulesOf('transition').some(readsTheCase)).toBe(true)
  })
})
