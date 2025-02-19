import {
  districtCourtAssistantRule,
  districtCourtJudgeRule,
  districtCourtRegistrarRule,
  prosecutorRepresentativeRule,
  prosecutorRule,
} from '../../../../guards'
import { CivilClaimantController } from '../../civilClaimant.controller'

describe('CivilClaimantController - Update rules', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let rules: any[]

  const expectedRules = [
    prosecutorRule,
    prosecutorRepresentativeRule,
    districtCourtJudgeRule,
    districtCourtRegistrarRule,
    districtCourtAssistantRule,
  ]

  beforeEach(() => {
    rules = Reflect.getMetadata(
      'roles-rules',
      CivilClaimantController.prototype.update,
    )
  })

  it('should give permission to roles', () => {
    expect(rules).toHaveLength(expectedRules.length)
    expectedRules.forEach((expectedRule) =>
      expect(rules).toContain(expectedRule),
    )
  })
})
