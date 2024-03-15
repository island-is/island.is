import { districtCourtJudgeRule } from '../../../../guards'
import { CaseController } from '../../case.controller'

describe('CaseController - Request ruling signature rules', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let rules: any[]

  beforeEach(() => {
    rules = Reflect.getMetadata(
      'roles-rules',
      CaseController.prototype.requestRulingSignature,
    )
  })

  it('should give permission to one roles', () => {
    expect(rules).toHaveLength(1)
    expect(rules).toContain(districtCourtJudgeRule)
  })
})
