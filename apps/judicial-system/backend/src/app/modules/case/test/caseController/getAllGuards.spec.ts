import { JwtAuthUserGuard, RolesGuard } from '@island.is/judicial-system/auth'

import { CaseController } from '../../case.controller'

describe('CaseController - Get all guards', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let guards: any[]

  beforeEach(() => {
    guards = Reflect.getMetadata('__guards__', CaseController.prototype.getAll)
  })

  it('should have the right guard configuration', () => {
    expect(guards).toHaveLength(2)
    expect(new guards[0]()).toBeInstanceOf(JwtAuthUserGuard)
    expect(new guards[1]()).toBeInstanceOf(RolesGuard)
  })
})
