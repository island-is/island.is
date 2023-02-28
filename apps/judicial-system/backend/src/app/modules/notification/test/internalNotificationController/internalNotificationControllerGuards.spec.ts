import { CanActivate } from '@nestjs/common'

import { TokenGuard } from '@island.is/judicial-system/auth'

import { UserExistsGuard } from '../../../user'
import { CaseHasExistedGuard } from '../../../case'
import { InternalNotificationController } from '../../internalNotification.controller'

describe('InternalNotificationController - guards', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let guards: any[]

  beforeEach(() => {
    guards = Reflect.getMetadata('__guards__', InternalNotificationController)
  })

  it('should have three guards', () => {
    expect(guards).toHaveLength(3)
  })

  describe('TokenGuard', () => {
    let guard: CanActivate

    beforeEach(() => {
      guard = new guards[0]()
    })

    it('should have TokenGuard as guard 1', () => {
      expect(guard).toBeInstanceOf(TokenGuard)
    })
  })

  describe('CaseHasExistedGuard', () => {
    let guard: CanActivate

    beforeEach(() => {
      guard = new guards[1]()
    })

    it('should have CaseHasExistedGuard as guard 2', () => {
      expect(guard).toBeInstanceOf(CaseHasExistedGuard)
    })
  })

  describe('UserExistsGuard', () => {
    let guard: CanActivate

    beforeEach(() => {
      guard = new guards[2]()
    })

    it('should have UserExistsGuard as guard 3', () => {
      expect(guard).toBeInstanceOf(UserExistsGuard)
    })
  })
})
