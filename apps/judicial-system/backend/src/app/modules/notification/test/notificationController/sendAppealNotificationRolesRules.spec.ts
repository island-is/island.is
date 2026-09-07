import {
  defenderAppealNotificationRule,
  prosecutorAppealNotificationRule,
} from '../../guards/rolesRules'
import { NotificationController } from '../../notification.controller'

describe('NotificationController - Send appeal notification rules', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let rules: any[]

  beforeEach(() => {
    rules = Reflect.getMetadata(
      'roles-rules',
      NotificationController.prototype.sendAppealNotification,
    )
  })

  it('should give permission to roles', () => {
    expect(rules).toHaveLength(2)
    expect(rules).toContain(prosecutorAppealNotificationRule)
    expect(rules).toContain(defenderAppealNotificationRule)
  })
})
