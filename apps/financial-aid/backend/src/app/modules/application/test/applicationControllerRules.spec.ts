import { RolesRule, StaffRole } from '@island.is/financial-aid/shared/lib'
import { ApplicationController } from '../application.controller'

describe('ApplicationController - Checks if user has a current application for this period rules', () => {
  let rules: any[]

  beforeEach(() => {
    rules = Reflect.getMetadata(
      'roles-rules',
      ApplicationController.prototype.getCurrentApplication,
    )
  })
  it('should have one rule', () => {
    expect(rules).toHaveLength(1)
  })

  it('should give permission to applicant', () => {
    expect(rules).toContain(RolesRule.OSK)
  })
})

describe('ApplicationController - Searches for application by nationalId rules', () => {
  let rules: any[]
  let staffrules: any[]

  beforeEach(() => {
    rules = Reflect.getMetadata(
      'roles-rules',
      ApplicationController.prototype.findApplication,
    )
  })
  it('should have one rule', () => {
    expect(rules).toHaveLength(1)
  })

  it('should give permission to staff', () => {
    expect(rules).toContain(RolesRule.VEITA)
  })

  beforeEach(() => {
    staffrules = Reflect.getMetadata(
      'staff-roles-rules',
      ApplicationController.prototype.findApplication,
    )
  })
  it('should have one rule', () => {
    expect(staffrules).toHaveLength(1)
  })

  it('should give permission to EMPLOYEE', () => {
    expect(staffrules).toContain(StaffRole.EMPLOYEE)
  })
})

describe('ApplicationController - Checking if user is spouse rules', () => {
  let rules: any[]

  beforeEach(() => {
    rules = Reflect.getMetadata(
      'roles-rules',
      ApplicationController.prototype.spouse,
    )
  })
  it('should have one rule', () => {
    expect(rules).toHaveLength(1)
  })

  it('should give permission to applicant', () => {
    expect(rules).toContain(RolesRule.OSK)
  })
})

describe('ApplicationController - Gets all existing applications', () => {
  let rules: any[]
  let staffrules: any[]

  beforeEach(() => {
    rules = Reflect.getMetadata(
      'roles-rules',
      ApplicationController.prototype.getAll,
    )
  })
  it('should have one rule', () => {
    expect(rules).toHaveLength(1)
  })

  it('should give permission to staff', () => {
    expect(rules).toContain(RolesRule.VEITA)
  })

  beforeEach(() => {
    staffrules = Reflect.getMetadata(
      'staff-roles-rules',
      ApplicationController.prototype.getAll,
    )
  })
  it('should have one rule', () => {
    expect(staffrules).toHaveLength(1)
  })

  it('should give permission to EMPLOYEE', () => {
    expect(staffrules).toContain(StaffRole.EMPLOYEE)
  })
})

describe('ApplicationController - Gets all existing applications filters rules', () => {
  let rules: any[]
  let staffrules: any[]

  beforeEach(() => {
    rules = Reflect.getMetadata(
      'roles-rules',
      ApplicationController.prototype.getAllFilters,
    )
  })
  it('should have one rule', () => {
    expect(rules).toHaveLength(1)
  })

  it('should give permission to staff', () => {
    expect(rules).toContain(RolesRule.VEITA)
  })

  beforeEach(() => {
    staffrules = Reflect.getMetadata(
      'staff-roles-rules',
      ApplicationController.prototype.getAllFilters,
    )
  })
  it('should have one rule', () => {
    expect(staffrules).toHaveLength(1)
  })

  it('should give permission to EMPLOYEE', () => {
    expect(staffrules).toContain(StaffRole.EMPLOYEE)
  })
})

describe('ApplicationController - Gets creates a new applicationrules', () => {
  let rules: any[]

  beforeEach(() => {
    rules = Reflect.getMetadata(
      'roles-rules',
      ApplicationController.prototype.create,
    )
  })
  it('should have one rule', () => {
    expect(rules).toHaveLength(1)
  })

  it('should give permission to staff', () => {
    expect(rules).toContain(RolesRule.OSK)
  })
})
