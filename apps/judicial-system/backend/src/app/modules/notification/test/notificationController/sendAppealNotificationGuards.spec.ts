import { CanActivate } from '@nestjs/common'

import { AppealCaseExistsGuard } from '../../../appeal-case'
import { CaseWriteGuard } from '../../../case'
import { NotificationController } from '../../notification.controller'

describe('NotificationController - Send appeal notification guards', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let guards: any[]

  beforeEach(() => {
    guards = Reflect.getMetadata(
      '__guards__',
      NotificationController.prototype.sendAppealNotification,
    )
  })

  it('should have two guards', () => {
    expect(guards).toHaveLength(2)
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

  describe('AppealCaseExistsGuard', () => {
    let guard: CanActivate

    beforeEach(() => {
      guard = new guards[1]()
    })

    it('should have AppealCaseExistsGuard as guard 2', () => {
      expect(guard).toBeInstanceOf(AppealCaseExistsGuard)
    })
  })
})
