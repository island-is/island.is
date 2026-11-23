import { RolesRule } from '@island.is/judicial-system/auth'

import { defenderRule } from '../../../../guards'
import { verifyRolesRules } from '../../../../test'
import { LimitedAccessVerdictController } from '../../limitedAccessVerdict.controller'

describe('LimitedAccessVerdictController - Accept Verdict Roles', () => {
  verifyRolesRules(LimitedAccessVerdictController, 'acceptVerdict', [
    defenderRule,
  ])

  // RolesGuard runs at class level, ahead of the locking read, which is only
  // safe while no rule on the route needs the case.
  it('should decide every rule on the user alone, without reading the case', () => {
    const rules: RolesRule[] =
      Reflect.getMetadata(
        'roles-rules',
        LimitedAccessVerdictController.prototype.acceptVerdict,
      ) ?? []

    expect(rules.length).toBeGreaterThan(0)
    rules.forEach((rule) => {
      expect(typeof rule === 'string' || rule.canActivate === undefined).toBe(
        true,
      )
    })
  })
})
