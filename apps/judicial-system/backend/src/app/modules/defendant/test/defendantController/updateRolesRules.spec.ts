import {
  districtCourtAssistantRule,
  districtCourtJudgeRule,
  districtCourtRegistrarRule,
  prosecutorRepresentativeRule,
  prosecutorRule,
} from '../../../../guards'
import { DefendantController } from '../../defendant.controller'

describe('DefendantController - Update rules', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let rules: any[]

  beforeEach(() => {
    rules = Reflect.getMetadata(
      'roles-rules',
      DefendantController.prototype.update,
    )
  })

  it('should give permission to roles', () => {
    expect(rules).toHaveLength(5)
    expect(rules).toContain(prosecutorRule)
    expect(rules).toContain(prosecutorRepresentativeRule)
    expect(rules).toContain(districtCourtJudgeRule)
    expect(rules).toContain(districtCourtRegistrarRule)
    expect(rules).toContain(districtCourtAssistantRule)
  })
})
