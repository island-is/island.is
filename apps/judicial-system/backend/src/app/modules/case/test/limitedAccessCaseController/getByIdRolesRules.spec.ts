import { defenderRule, prisonSystemStaffRule } from '../../../../guards'
import { LimitedAccessCaseController } from '../../limitedAccessCase.controller'

describe('LimitedAccessCaseController - Get by id rules', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let rules: any[]

  beforeEach(() => {
    rules = Reflect.getMetadata(
      'roles-rules',
      LimitedAccessCaseController.prototype.getById,
    )
  })

  it('should give permission to roles', () => {
    expect(rules).toHaveLength(2)
    expect(rules).toContain(prisonSystemStaffRule)
    expect(rules).toContain(defenderRule)
  })
})
