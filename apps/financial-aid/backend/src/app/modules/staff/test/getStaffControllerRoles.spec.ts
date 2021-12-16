import { RolesRule } from '@island.is/financial-aid/shared/lib'

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
