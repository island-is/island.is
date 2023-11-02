import { CanActivate } from '@nestjs/common'

import { CaseReadGuard } from '../../../case'
import { NotificationController } from '../../notification.controller'

describe('NotificationController - Get all case notifications guards', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let guards: any[]

  beforeEach(() => {
    guards = Reflect.getMetadata(
      '__guards__',
      NotificationController.prototype.getAllCaseNotifications,
    )
  })

  it('should have two guards', () => {
    expect(guards).toHaveLength(1)
  })

  describe('CaseReadGuard', () => {
    let guard: CanActivate

    beforeEach(() => {
      guard = new guards[0]()
    })

    it('should have CaseReadGuard as guard 1', () => {
      expect(guard).toBeInstanceOf(CaseReadGuard)
    })
  })
})
