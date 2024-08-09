import { TokenGuard } from '@island.is/judicial-system/auth'

import { InternalNotificationController } from '../../internalNotification.controller'

describe('InternalNotificationController - guards', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let guards: any[]

  beforeEach(() => {
    guards = Reflect.getMetadata('__guards__', InternalNotificationController)
  })

  it('should have the right guard configuration', () => {
    expect(guards).toHaveLength(1)
    expect(new guards[0]()).toBeInstanceOf(TokenGuard)
  })
})
