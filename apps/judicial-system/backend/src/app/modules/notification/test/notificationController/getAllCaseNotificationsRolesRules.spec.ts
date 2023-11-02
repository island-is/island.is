import {
  assistantRule,
  judgeRule,
  prosecutorRepresentativeRule,
  prosecutorRule,
  registrarRule,
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

  it('should give permission to five roles', () => {
    expect(rules).toHaveLength(5)
    expect(rules).toContain(prosecutorRule)
    expect(rules).toContain(prosecutorRepresentativeRule)
    expect(rules).toContain(judgeRule)
    expect(rules).toContain(registrarRule)
    expect(rules).toContain(assistantRule)
  })
})
