import {
  courtOfAppealsAssistantRule,
  courtOfAppealsJudgeRule,
  courtOfAppealsRegistrarRule,
  districtCourtAssistantRule,
  districtCourtJudgeRule,
  districtCourtRegistrarRule,
  prisonSystemStaffRule,
  prosecutorRepresentativeRule,
  prosecutorRule,
  publicProsecutorStaffRule,
} from '../../../../guards'
import { FileController } from '../../file.controller'

describe('FileController - Get case file signed url rules', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let rules: any[]

  beforeEach(() => {
    rules = Reflect.getMetadata(
      'roles-rules',
      FileController.prototype.getCaseFileSignedUrl,
    )
  })

  it('should give permission to roles', () => {
    expect(rules).toHaveLength(10)
    expect(rules).toContain(prosecutorRule)
    expect(rules).toContain(prosecutorRepresentativeRule)
    expect(rules).toContain(publicProsecutorStaffRule)
    expect(rules).toContain(districtCourtJudgeRule)
    expect(rules).toContain(districtCourtRegistrarRule)
    expect(rules).toContain(districtCourtAssistantRule)
    expect(rules).toContain(courtOfAppealsJudgeRule)
    expect(rules).toContain(courtOfAppealsRegistrarRule)
    expect(rules).toContain(courtOfAppealsAssistantRule)
    expect(rules).toContain(prisonSystemStaffRule)
  })
})
