import {
  prosecutorNotificationRule,
  judgeNotificationRule,
  registrarNotificationRule,
  representativeNotificationRule,
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

  it('should give permission to four roles', () => {
    expect(rules).toHaveLength(4)
  })

  it('should give permission to prosecutors, representatives, judges and registrars', () => {
    expect(rules).toContain(prosecutorNotificationRule)
    expect(rules).toContain(representativeNotificationRule)
    expect(rules).toContain(judgeNotificationRule)
    expect(rules).toContain(registrarNotificationRule)
  })
})
