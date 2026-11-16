import { JwtAuthUserGuard } from '@island.is/judicial-system/auth'

import { ServiceInterruptionBannerController } from '../serviceInterruptionBanner.controller'

describe('ServiceInterruptionBannerController - Get guards', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let guards: any[]

  beforeEach(() => {
    guards = Reflect.getMetadata(
      '__guards__',
      ServiceInterruptionBannerController.prototype.get,
    )
  })

  it('should have JwtAuthUserGuard only (any authenticated user)', () => {
    expect(guards).toHaveLength(1)
    expect(new guards[0]()).toBeInstanceOf(JwtAuthUserGuard)
  })
})
