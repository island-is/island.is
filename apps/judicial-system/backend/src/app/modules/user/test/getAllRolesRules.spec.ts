import {
  adminRule,
  courtOfAppealsAssistantRule,
  courtOfAppealsJudgeRule,
  courtOfAppealsRegistrarRule,
  districtCourtAssistantRule,
  districtCourtJudgeRule,
  districtCourtRegistrarRule,
  localAdminRule,
  prosecutorRepresentativeRule,
  prosecutorRule,
  publicProsecutorStaffRule,
} from '../../../guards'
import { UserController } from '../user.controller'

describe('UserController - Get all rules', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let rules: any[]

  beforeEach(() => {
    rules = Reflect.getMetadata('roles-rules', UserController.prototype.getAll)
  })

  it('should give permission to roles', () => {
    expect(rules).toHaveLength(11)
    expect(rules).toContain(adminRule)
    expect(rules).toContain(localAdminRule)
    expect(rules).toContain(prosecutorRule)
    expect(rules).toContain(prosecutorRepresentativeRule)
    expect(rules).toContain(districtCourtJudgeRule)
    expect(rules).toContain(districtCourtRegistrarRule)
    expect(rules).toContain(districtCourtAssistantRule)
    expect(rules).toContain(courtOfAppealsJudgeRule)
    expect(rules).toContain(courtOfAppealsRegistrarRule)
    expect(rules).toContain(courtOfAppealsAssistantRule)
    expect(rules).toContain(publicProsecutorStaffRule)
  })
})
