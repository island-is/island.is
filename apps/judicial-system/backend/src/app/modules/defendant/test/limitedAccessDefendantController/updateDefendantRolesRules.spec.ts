import { prisonSystemStaffUpdateRule } from '../../guards/rolesRules'
import { LimitedAccessDefendantController } from '../../limitedAccessDefendant.controller'

describe('LimitedAccessDefendantController - Update defendant roles rules', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let rules: any[]

  beforeEach(() => {
    rules = Reflect.getMetadata(
      'roles-rules',
      LimitedAccessDefendantController.prototype.updateDefendant,
    )
  })

  it('should give permission to roles', () => {
    expect(rules).toHaveLength(1)
    expect(rules).toContain(prisonSystemStaffUpdateRule)
  })
})
