import { CaseController } from '../../case.controller'
import {
  courtOfAppealsAssistantTransitionRule,
  courtOfAppealsJudgeTransitionRule,
  courtOfAppealsRegistrarTransitionRule,
  districtCourtAssistantTransitionRule,
  districtCourtJudgeTransitionRule,
  districtCourtRegistrarTransitionRule,
  prosecutorRepresentativeTransitionRule,
  prosecutorTransitionRule,
} from '../../guards/rolesRules'

describe('CaseController - Transition rules', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let rules: any[]

  beforeEach(() => {
    rules = Reflect.getMetadata(
      'roles-rules',
      CaseController.prototype.transition,
    )
  })

  it('should give permission to roles', () => {
    expect(rules).toHaveLength(8)
    expect(rules).toContain(prosecutorTransitionRule)
    expect(rules).toContain(prosecutorRepresentativeTransitionRule)
    expect(rules).toContain(districtCourtJudgeTransitionRule)
    expect(rules).toContain(districtCourtRegistrarTransitionRule)
    expect(rules).toContain(districtCourtAssistantTransitionRule)
    expect(rules).toContain(courtOfAppealsJudgeTransitionRule)
    expect(rules).toContain(courtOfAppealsRegistrarTransitionRule)
    expect(rules).toContain(courtOfAppealsAssistantTransitionRule)
  })
})
