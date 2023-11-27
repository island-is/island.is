import {
  districtCourtJudgeRule,
  districtCourtRegistrarRule,
} from '../../../../guards'
import { CaseController } from '../../case.controller'

describe('CaseController - Get court record signature confirmation rules', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let rules: any[]

  beforeEach(() => {
    rules = Reflect.getMetadata(
      'roles-rules',
      CaseController.prototype.getCourtRecordSignatureConfirmation,
    )
  })

  it('should give permission to roles', () => {
    expect(rules).toHaveLength(2)
    expect(rules).toContain(districtCourtJudgeRule)
    expect(rules).toContain(districtCourtRegistrarRule)
  })
})
