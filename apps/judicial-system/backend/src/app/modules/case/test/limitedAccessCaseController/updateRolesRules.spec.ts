import {
  defenderUpdateRule,
  prisonSystemAdminUpdateRule,
} from '../../guards/rolesRules'
import { LimitedAccessCaseController } from '../../limitedAccessCase.controller'

describe('LimitedAccessCaseController - Update rules', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let rules: any[]

  beforeEach(() => {
    rules = Reflect.getMetadata(
      'roles-rules',
      LimitedAccessCaseController.prototype.update,
    )
  })

  it('should give permission to one roles', () => {
    expect(rules).toHaveLength(2)
    expect(rules).toContain(defenderUpdateRule)
    expect(rules).toContain(prisonSystemAdminUpdateRule)
  })
})
