import {
  defenderNotificationRule,
  districtCourtAssistantNotificationRule,
  districtCourtJudgeNotificationRule,
  districtCourtRegistrarNotificationRule,
  prosecutorNotificationRule,
} from '../../guards/rolesRules'
import { NotificationController } from '../../notification.controller'

describe('NotificationController - Send case notification rules', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let rules: any[]

  beforeEach(() => {
    rules = Reflect.getMetadata(
      'roles-rules',
      NotificationController.prototype.sendCaseNotification,
    )
  })

  it('should give permission to roles', () => {
    expect(rules).toHaveLength(5)
    expect(rules).toContain(prosecutorNotificationRule)
    expect(rules).toContain(districtCourtJudgeNotificationRule)
    expect(rules).toContain(districtCourtRegistrarNotificationRule)
    expect(rules).toContain(districtCourtAssistantNotificationRule)
    expect(rules).toContain(defenderNotificationRule)
  })
})
