import { StaffRole } from '@island.is/financial-aid/shared/lib'

import { MunicipalityController } from '../municipality.controller'
describe('MunicipalityController - Creates a new municipality rule', () => {
  let rules: any[]

  beforeEach(() => {
    rules = Reflect.getMetadata(
      'staff-roles-rules',
      MunicipalityController.prototype.create,
    )
  })
  it('should have one rule', () => {
    expect(rules).toHaveLength(1)
  })
  it('should give permission to superadmin', () => {
    expect(rules).toContain(StaffRole.SUPERADMIN)
  })
})

describe('MunicipalityController - Gets municipalities rule', () => {
  let rules: any[]

  beforeEach(() => {
    rules = Reflect.getMetadata(
      'staff-roles-rules',
      MunicipalityController.prototype.getAllMunicipalities,
    )
  })
  it('should have one rule', () => {
    expect(rules).toHaveLength(1)
  })
  it('should give permission to superadmin', () => {
    expect(rules).toContain(StaffRole.SUPERADMIN)
  })
})

describe('MunicipalityController - Updates municipality rule', () => {
  let rules: any[]

  beforeEach(() => {
    rules = Reflect.getMetadata(
      'staff-roles-rules',
      MunicipalityController.prototype.updateMunicipality,
    )
  })
  it('should have one rule', () => {
    expect(rules).toHaveLength(1)
  })
  it('should give permission to ADMIN', () => {
    expect(rules).toContain(StaffRole.ADMIN)
  })
})

describe('MunicipalityController - Updates activity for municipality rules', () => {
  let rules: any[]

  beforeEach(() => {
    rules = Reflect.getMetadata(
      'staff-roles-rules',
      MunicipalityController.prototype.updateMunicipalityActivity,
    )
  })
  it('should have one rule', () => {
    expect(rules).toHaveLength(1)
  })
  it('should give permission to SUPERADMIN', () => {
    expect(rules).toContain(StaffRole.SUPERADMIN)
  })
})
