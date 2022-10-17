import {
  prosecutorNotificationRule,
  judgeNotificationRule,
  registrarNotificationRule,
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
    expect(rules).toHaveLength(3)
  })

  it('should give permission to prosecutors', () => {
    expect(rules).toContain(prosecutorNotificationRule)
  })

  it('should give permission to judges', () => {
    expect(rules).toContain(judgeNotificationRule)
  })

  it('should give permission to registrars', () => {
    expect(rules).toContain(registrarNotificationRule)
  })
})
