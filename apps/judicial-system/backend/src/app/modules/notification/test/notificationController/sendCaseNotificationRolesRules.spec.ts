import {
  prosecutorNotificationRule,
  judgeNotificationRule,
  registrarNotificationRule,
  representativeNotificationRule,
  assistantNotificationRule,
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

  it('should give permission to five roles', () => {
    expect(rules).toHaveLength(5)
  })

  it('should give permission to prosecutors, representatives, judges, registrars and assistants', () => {
    expect(rules).toContain(prosecutorNotificationRule)
    expect(rules).toContain(representativeNotificationRule)
    expect(rules).toContain(judgeNotificationRule)
    expect(rules).toContain(registrarNotificationRule)
    expect(rules).toContain(assistantNotificationRule)
  })
})
