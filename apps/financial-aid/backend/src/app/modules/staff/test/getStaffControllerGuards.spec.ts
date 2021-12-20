import { IdsUserGuard } from '@island.is/auth-nest-tools'
import { CanActivate } from '@nestjs/common'
import { RolesGuard } from '../../../guards/roles.guard'

import { StaffController } from '../staff.controller'

describe('StaffController - Get guards', () => {
  let guards: any[]

  beforeEach(() => {
    guards = Reflect.getMetadata('__guards__', StaffController)
  })

  it('should have two guards', () => {
    expect(guards).toHaveLength(2)
  })

  describe('IdsUserGuard', () => {
    let guard: CanActivate

    beforeEach(() => {
      guard = new guards[0]()
    })

    it('should have IdsUserGuard as quard 1', () => {
      expect(guard).toBeInstanceOf(IdsUserGuard)
    })
  })

  describe('RolesGuard', () => {
    let guard: CanActivate

    beforeEach(() => {
      guard = new guards[1]()
    })

    it('should have RolesGuard as quard 2', () => {
      expect(guard).toBeInstanceOf(RolesGuard)
    })
  })
})

describe('StaffController - Gets staff for municipality guard', () => {
  let guards: any[]

  beforeEach(() => {
    guards = Reflect.getMetadata(
      '__guards__',
      StaffController.prototype.getStaffForMunicipality,
    )
  })
  it('should have one guard', () => {
    expect(guards).toHaveLength(1)
  })
  describe('StaffGuard', () => {
    let guard: CanActivate

    beforeEach(() => {
      guards = Reflect.getMetadata(
        '__guards__',
        StaffController.prototype.getStaffForMunicipality,
      )
    })
    it('should have one guards', () => {
      expect(guards).toHaveLength(1)
    })
  })
})

describe('StaffController -  Counts users for municipality guard', () => {
  let guards: any[]

  beforeEach(() => {
    guards = Reflect.getMetadata(
      '__guards__',
      StaffController.prototype.numberOfUsersForMunicipality,
    )
  })
  it('should have one guards', () => {
    expect(guards).toHaveLength(1)
  })
})

describe('StaffController - creates staff guard', () => {
  let guards: any[]

  beforeEach(() => {
    guards = Reflect.getMetadata(
      '__guards__',
      StaffController.prototype.createStaff,
    )
  })
  it('should have one guards', () => {
    expect(guards).toHaveLength(1)
  })
})

describe('StaffController - Gets admin users by municipality id guard', () => {
  let guards: any[]

  beforeEach(() => {
    guards = Reflect.getMetadata(
      '__guards__',
      StaffController.prototype.getUsers,
    )
  })
  it('should have one guards', () => {
    expect(guards).toHaveLength(1)
  })
})

describe('StaffController - Gets supervisors guard', () => {
  let guards: any[]

  beforeEach(() => {
    guards = Reflect.getMetadata(
      '__guards__',
      StaffController.prototype.getSupervisors,
    )
  })
  it('should have one guards', () => {
    expect(guards).toHaveLength(1)
  })
})
