import { defenderTransitionRule } from '../../guards/rolesRules'
import { LimitedAccessCaseController } from '../../limitedAccessCase.controller'

describe('LimitedAccessCaseController - Transition rules', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let rules: any[]

  beforeEach(() => {
    rules = Reflect.getMetadata(
      'roles-rules',
      LimitedAccessCaseController.prototype.transition,
    )
  })

  it('should give permission to one roles', () => {
    expect(rules).toHaveLength(1)
    expect(rules).toContain(defenderTransitionRule)
  })
})
