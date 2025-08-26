import { JwtAuthUserGuard, RolesGuard } from '@island.is/judicial-system/auth'

import { CivilClaimantController } from '../../civilClaimant.controller'

describe('CivilClaimantController - guards', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let guards: any[]

  beforeEach(() => {
    guards = Reflect.getMetadata('__guards__', CivilClaimantController)
  })

  it('should have the right guard configuration', () => {
    expect(guards).toHaveLength(2)
    expect(new guards[0]()).toBeInstanceOf(JwtAuthUserGuard)
    expect(new guards[1]()).toBeInstanceOf(RolesGuard)
  })
})
