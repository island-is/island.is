import { RolesRule, StaffRole } from '@island.is/financial-aid/shared/lib'

import { StaffController } from '../staff.controller'

describe('StaffController - Get rules', () => {
  let rules: any[]

  beforeEach(() => {
    rules = Reflect.getMetadata('roles-rules', StaffController)
  })
  it('should have one rule', () => {
    expect(rules).toHaveLength(1)
  })

  it('should give permission to veitu staff', () => {
    expect(rules).toContain(RolesRule.VEITA)
  })
})

describe('StaffController -  Creates staff rules', () => {
  let rules: any[]

  beforeEach(() => {
    rules = Reflect.getMetadata(
      'staff-roles-rules',
      StaffController.prototype.createStaff,
    )
  })
  it('should have two rule', () => {
    expect(rules).toHaveLength(2)
  })

  it('should give permission to admin', () => {
    expect(rules).toContain(StaffRole.ADMIN)
  })
  it('should give permission to admin', () => {
    expect(rules).toContain(StaffRole.SUPERADMIN)
  })
})

describe('StaffController -  Counts users for municipality rules', () => {
  let rules: any[]

  beforeEach(() => {
    rules = Reflect.getMetadata(
      'staff-roles-rules',
      StaffController.prototype.numberOfUsersForMunicipality,
    )
  })
  it('should have one rule', () => {
    expect(rules).toHaveLength(1)
  })

  it('should give permission to superadmin', () => {
    expect(rules).toContain(StaffRole.SUPERADMIN)
  })
})

describe('StaffController -  Gets admin users by municipality id rules', () => {
  let rules: any[]

  beforeEach(() => {
    rules = Reflect.getMetadata(
      'staff-roles-rules',
      StaffController.prototype.getUsers,
    )
  })
  it('should have one rule', () => {
    expect(rules).toHaveLength(1)
  })

  it('should give permission to superadmin', () => {
    expect(rules).toContain(StaffRole.SUPERADMIN)
  })
})

describe('StaffController -  Gets admin users by municipality id rules', () => {
  let rules: any[]

  beforeEach(() => {
    rules = Reflect.getMetadata(
      'staff-roles-rules',
      StaffController.prototype.getSupervisors,
    )
  })
  it('should have one rule', () => {
    expect(rules).toHaveLength(1)
  })

  it('should give permission to superadmin', () => {
    expect(rules).toContain(StaffRole.SUPERADMIN)
  })
})

describe('StaffController -  Gets staff for municipality rules', () => {
  let rules: any[]

  beforeEach(() => {
    rules = Reflect.getMetadata(
      'staff-roles-rules',
      StaffController.prototype.getStaffForMunicipality,
    )
  })
  it('should have one rule', () => {
    expect(rules).toHaveLength(1)
  })

  it('should give permission to admin', () => {
    expect(rules).toContain(StaffRole.ADMIN)
  })
})
