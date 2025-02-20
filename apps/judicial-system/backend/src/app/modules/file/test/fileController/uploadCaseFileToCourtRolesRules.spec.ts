import {
  districtCourtAssistantRule,
  districtCourtJudgeRule,
  districtCourtRegistrarRule,
} from '../../../../guards'
import { FileController } from '../../file.controller'

describe('FileController - Update case file to court rules', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let rules: any[]

  beforeEach(() => {
    rules = Reflect.getMetadata(
      'roles-rules',
      FileController.prototype.uploadCaseFileToCourt,
    )
  })

  it('should give permission to three roles', () => {
    expect(rules).toHaveLength(3)
    expect(rules).toContain(districtCourtJudgeRule)
    expect(rules).toContain(districtCourtRegistrarRule)
    expect(rules).toContain(districtCourtAssistantRule)
  })
})
