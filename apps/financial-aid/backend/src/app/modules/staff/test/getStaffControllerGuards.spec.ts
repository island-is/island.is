import { IdsUserGuard } from '@island.is/auth-nest-tools'
import { CanActivate } from '@nestjs/common'
import { RolesGuard } from '../../../guards/roles.guard'

import { StaffController } from '../staff.controller'

jest.mock('../staff.service')

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

  describe('RolesGuard', () => {
    let guard: CanActivate

    beforeEach(() => {
      guard = new guards[1]()
    })

    it('should have RolesGuard as guard 1', () => {
      expect(guard).toBeInstanceOf(RolesGuard)
    })
  })
})
