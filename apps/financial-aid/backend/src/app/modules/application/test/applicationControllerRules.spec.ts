import { StaffRole } from '@island.is/financial-aid/shared/lib'
import { ApplicationController } from '../application.controller'

describe('ApplicationController - Searches for application by nationalId rules', () => {
  describe('ApplicationController - findApplication staff rules', () => {
    let staffrules: any[]

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
})

describe('ApplicationController - Gets all existing applications', () => {
  describe('ApplicationController - getAll staff rule', () => {
    let staffrules: any[]

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
})

describe('ApplicationController - Gets all existing applications filters rules', () => {
  describe('ApplicationController - getAllFilters  staff rules', () => {
    let staffrules: any[]

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
})
