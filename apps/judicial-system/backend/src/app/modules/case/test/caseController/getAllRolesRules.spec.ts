import {
  courtOfAppealsAssistantRule,
  courtOfAppealsJudgeRule,
  courtOfAppealsRegistrarRule,
  defenderRule,
  districtCourtAssistantRule,
  districtCourtJudgeRule,
  districtCourtRegistrarRule,
  prisonSystemStaffRule,
  prosecutorRepresentativeRule,
  prosecutorRule,
} from '../../../../guards'
import { CaseController } from '../../case.controller'

describe('CaseController - Get all rules', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let rules: any[]

  beforeEach(() => {
    rules = Reflect.getMetadata('roles-rules', CaseController.prototype.getAll)
  })

  it('should give permission to roles', () => {
    expect(rules).toHaveLength(10)
    expect(rules).toContain(prosecutorRule)
    expect(rules).toContain(prosecutorRepresentativeRule)
    expect(rules).toContain(districtCourtJudgeRule)
    expect(rules).toContain(districtCourtRegistrarRule)
    expect(rules).toContain(districtCourtAssistantRule)
    expect(rules).toContain(courtOfAppealsJudgeRule)
    expect(rules).toContain(courtOfAppealsRegistrarRule)
    expect(rules).toContain(courtOfAppealsAssistantRule)
    expect(rules).toContain(prisonSystemStaffRule)
    expect(rules).toContain(defenderRule)
  })
})
