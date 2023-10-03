import {
  assistantRule,
  defenderRule,
  judgeRule,
  prisonSystemStaffRule,
  prosecutorRepresentativeRule,
  prosecutorRule,
  registrarRule,
} from '../../../../guards'
import { CaseController } from '../../case.controller'

describe('CaseController - Get all rules', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let rules: any[]

  beforeEach(() => {
    rules = Reflect.getMetadata('roles-rules', CaseController.prototype.getAll)
  })

  it('should give permission to seven roles', () => {
    expect(rules).toHaveLength(7)
    expect(rules).toContain(prosecutorRule)
    expect(rules).toContain(prosecutorRepresentativeRule)
    expect(rules).toContain(judgeRule)
    expect(rules).toContain(registrarRule)
    expect(rules).toContain(assistantRule)
    expect(rules).toContain(prisonSystemStaffRule)
    expect(rules).toContain(defenderRule)
  })
})
