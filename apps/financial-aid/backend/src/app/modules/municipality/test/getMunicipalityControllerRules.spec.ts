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
  it('should give permission to veitu staff', () => {
    expect(rules).toContain(StaffRole.SUPERADMIN)
  })
})
