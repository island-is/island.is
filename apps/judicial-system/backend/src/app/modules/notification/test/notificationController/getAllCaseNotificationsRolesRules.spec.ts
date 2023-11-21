import {
  courtOfAppealsAssistantRule,
  courtOfAppealsJudgeRule,
  courtOfAppealsRegistrarRule,
  districtCourtAssistantRule,
  districtCourtJudgeRule,
  districtCourtRegistrarRule,
  prosecutorRepresentativeRule,
  prosecutorRule,
} from '../../../../guards'
import { NotificationController } from '../../notification.controller'

describe('NotificationController - Get all case notifications rules', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let rules: any[]

  beforeEach(() => {
    rules = Reflect.getMetadata(
      'roles-rules',
      NotificationController.prototype.getAllCaseNotifications,
    )
  })

  it('should give permission to roles', () => {
    expect(rules).toHaveLength(8)
    expect(rules).toContain(prosecutorRule)
    expect(rules).toContain(prosecutorRepresentativeRule)
    expect(rules).toContain(districtCourtJudgeRule)
    expect(rules).toContain(districtCourtRegistrarRule)
    expect(rules).toContain(districtCourtAssistantRule)
    expect(rules).toContain(courtOfAppealsJudgeRule)
    expect(rules).toContain(courtOfAppealsRegistrarRule)
    expect(rules).toContain(courtOfAppealsAssistantRule)
  })
})
