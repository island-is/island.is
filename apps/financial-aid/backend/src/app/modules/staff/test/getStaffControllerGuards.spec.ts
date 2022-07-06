import { IdsUserGuard, ScopesGuard } from '@island.is/auth-nest-tools'
import { CanActivate } from '@nestjs/common'
import { StaffGuard } from '../../../guards/staff.guard'

import { StaffController } from '../staff.controller'

describe('StaffController - Get guards', () => {
  let guards: any[]

  beforeEach(() => {
    guards = Reflect.getMetadata('__guards__', StaffController)
  })

  it('should have three guards', () => {
    expect(guards).toHaveLength(3)
  })

  describe('IdsUserGuard', () => {
    let guard: CanActivate

    beforeEach(() => {
      guard = new guards[0]()
    })

    it('should have IdsUserGuard as guard 0', () => {
      expect(guard).toBeInstanceOf(IdsUserGuard)
    })
  })

  describe('ScopesGuard', () => {
    let guard: CanActivate

    beforeEach(() => {
      guard = new guards[1]()
    })

    it('should have ScopesGuard as guard 1', () => {
      expect(guard).toBeInstanceOf(ScopesGuard)
    })
  })

  describe('StaffGuard', () => {
    let guard: CanActivate

    beforeEach(() => {
      guard = new guards[2]()
    })

    it('should have StaffGuard as guard 2', () => {
      expect(guard).toBeInstanceOf(StaffGuard)
    })
  })
})
