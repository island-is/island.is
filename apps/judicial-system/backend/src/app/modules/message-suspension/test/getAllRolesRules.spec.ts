import { adminRule } from '../../../guards'
import { messageSuspensionManagerRule } from '../guards/rolesRules'
import { MessageSuspensionController } from '../messageSuspension.controller'

describe('MessageSuspensionController - Get all rules', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let rules: any[]

  beforeEach(() => {
    rules = Reflect.getMetadata(
      'roles-rules',
      MessageSuspensionController.prototype.getAll,
    )
  })

  it('should give permission to admins and message suspension managers', () => {
    expect(rules).toHaveLength(2)
    expect(rules).toContain(adminRule)
    expect(rules).toContain(messageSuspensionManagerRule)
  })
})
