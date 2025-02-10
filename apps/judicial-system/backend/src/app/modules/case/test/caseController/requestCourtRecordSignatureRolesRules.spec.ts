import {
  districtCourtAssistantRule,
  districtCourtJudgeRule,
  districtCourtRegistrarRule,
} from '../../../../guards'
import { CaseController } from '../../case.controller'

describe('CaseController - Request court record signature rules', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let rules: any[]

  beforeEach(() => {
    rules = Reflect.getMetadata(
      'roles-rules',
      CaseController.prototype.requestCourtRecordSignature,
    )
  })

  it('should give permission to three roles', () => {
    expect(rules).toHaveLength(3)
    expect(rules).toContain(districtCourtJudgeRule)
    expect(rules).toContain(districtCourtRegistrarRule)
    expect(rules).toContain(districtCourtAssistantRule)
  })
})
