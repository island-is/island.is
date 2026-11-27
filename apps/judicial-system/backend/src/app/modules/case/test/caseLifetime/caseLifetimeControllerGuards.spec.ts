import { JwtAuthUserGuard, RolesGuard } from '@island.is/judicial-system/auth'

import { adminRule } from '../../../../guards'
import { CaseLifetimeController } from '../../caseLifetime.controller'

describe('CaseLifetimeController - guards', () => {
  it('should authenticate the user and check the role, and nothing else', () => {
    const guards = Reflect.getMetadata('__guards__', CaseLifetimeController)

    expect(guards).toEqual([JwtAuthUserGuard, RolesGuard])
  })

  it('should only give permission to super admins', () => {
    const rules = Reflect.getMetadata(
      'roles-rules',
      CaseLifetimeController.prototype.extend,
    )

    expect(rules).toEqual([adminRule])
  })
})
