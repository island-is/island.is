import { CaseController } from '../../case.controller'
import {
  courtOfAppealsAssistantUpdateRule,
  courtOfAppealsJudgeUpdateRule,
  courtOfAppealsRegistrarUpdateRule,
  districtCourtAssistantUpdateRule,
  districtCourtJudgeUpdateRule,
  districtCourtRegistrarUpdateRule,
  prosecutorRepresentativeUpdateRule,
  prosecutorUpdateRule,
  publicProsecutorStaffUpdateRule,
} from '../../guards/rolesRules'

describe('CaseController - Update rules', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let rules: any[]

  beforeEach(() => {
    rules = Reflect.getMetadata('roles-rules', CaseController.prototype.update)
  })

  it('should give permission to roles', () => {
    expect(rules).toHaveLength(9)
    expect(rules).toContain(prosecutorUpdateRule)
    expect(rules).toContain(prosecutorRepresentativeUpdateRule)
    expect(rules).toContain(districtCourtJudgeUpdateRule)
    expect(rules).toContain(districtCourtRegistrarUpdateRule)
    expect(rules).toContain(districtCourtAssistantUpdateRule)
    expect(rules).toContain(courtOfAppealsJudgeUpdateRule)
    expect(rules).toContain(courtOfAppealsRegistrarUpdateRule)
    expect(rules).toContain(courtOfAppealsAssistantUpdateRule)
    expect(rules).toContain(publicProsecutorStaffUpdateRule)
  })
})
