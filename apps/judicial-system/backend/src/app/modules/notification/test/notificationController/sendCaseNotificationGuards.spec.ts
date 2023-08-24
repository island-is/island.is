import { CanActivate } from '@nestjs/common'

import { CaseWriteGuard } from '../../../case'
import { NotificationController } from '../../notification.controller'

describe('NotificationController - Send case notification guards', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let guards: any[]

  beforeEach(() => {
    guards = Reflect.getMetadata(
      '__guards__',
      NotificationController.prototype.sendCaseNotification,
    )
  })

  it('should have one guards', () => {
    expect(guards).toHaveLength(1)
  })

  describe('CaseWriteGuard', () => {
    let guard: CanActivate

    beforeEach(() => {
      guard = new guards[0]()
    })

    it('should have CaseWriteGuard as guard 1', () => {
      expect(guard).toBeInstanceOf(CaseWriteGuard)
    })
  })
})
