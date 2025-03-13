import { CanActivate } from '@nestjs/common'

import { JwtAuthUserGuard, RolesGuard } from '@island.is/judicial-system/auth'

import { CaseExistsGuard } from '../../../case'
import { NotificationController } from '../../notification.controller'

describe('NotificationController - guards', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let guards: any[]

  beforeEach(() => {
    guards = Reflect.getMetadata('__guards__', NotificationController)
  })

  it('should have three guards', () => {
    expect(guards).toHaveLength(3)
  })

  describe('JwtAuthUserGuard', () => {
    let guard: CanActivate

    beforeEach(() => {
      guard = new guards[0]()
    })

    it('should have JwtAuthUserGuard as guard 0', () => {
      expect(guard).toBeInstanceOf(JwtAuthUserGuard)
    })
  })

  describe('RolesGuard', () => {
    let guard: CanActivate

    beforeEach(() => {
      guard = new guards[1]()
    })

    it('should have RolesGuard as guard 1', () => {
      expect(guard).toBeInstanceOf(RolesGuard)
    })
  })

  describe('CaseExistsGuard', () => {
    let guard: CanActivate

    beforeEach(() => {
      guard = new guards[2]()
    })

    it('should have CaseExistsGuard as guard 2', () => {
      expect(guard).toBeInstanceOf(CaseExistsGuard)
    })
  })
})
