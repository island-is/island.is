import { JwtAuthUserGuard, RolesGuard } from '@island.is/judicial-system/auth'

import { DefendantController } from '../../defendant.controller'

describe('DefendantController - guards', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let guards: any[]

  beforeEach(() => {
    guards = Reflect.getMetadata('__guards__', DefendantController)
  })

  it('should have the right guard configuration', () => {
    expect(guards).toHaveLength(2)
    expect(new guards[0]()).toBeInstanceOf(JwtAuthUserGuard)
    expect(new guards[1]()).toBeInstanceOf(RolesGuard)
  })
})
