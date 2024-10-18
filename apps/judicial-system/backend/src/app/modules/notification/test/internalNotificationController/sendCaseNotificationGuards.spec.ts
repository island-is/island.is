import { CanActivate } from '@nestjs/common'

import { CaseHasExistedGuard } from '../../../case'
import { InternalNotificationController } from '../../internalNotification.controller'

describe('InternalNotificationController - Send case notification guards', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let guards: any[]

  beforeEach(() => {
    guards = Reflect.getMetadata(
      '__guards__',
      InternalNotificationController.prototype.sendCaseNotification,
    )
  })

  it('should have one guards', () => {
    expect(guards).toHaveLength(1)
  })

  describe('CaseHasExistedGuard', () => {
    let guard: CanActivate

    beforeEach(() => {
      guard = new guards[0]()
    })

    it('should have CaseHasExistedGuard as guard 1', () => {
      expect(guard).toBeInstanceOf(CaseHasExistedGuard)
    })
  })
})
