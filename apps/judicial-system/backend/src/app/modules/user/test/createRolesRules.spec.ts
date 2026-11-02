import { adminRule } from '../../../guards'
import { localAdminManageUserRule } from '../guards/rolesRules'
import { UserController } from '../user.controller'

describe('UserController - Create rules', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let rules: any[]

  beforeEach(() => {
    rules = Reflect.getMetadata('roles-rules', UserController.prototype.create)
  })

  it('should give permission to roles', () => {
    expect(rules).toHaveLength(2)
    expect(rules).toContain(adminRule)
    expect(rules).toContain(localAdminManageUserRule)
  })

  it('should not let local admins change capability flags', () => {
    if (typeof localAdminManageUserRule === 'string') {
      throw new Error('Expected a rule object')
    }

    // Local admins may manage users as long as they leave the flags untouched ...
    expect(localAdminManageUserRule.canActivate?.({ body: {} })).toBe(true)
    // ... but may not set them - to any value
    expect(
      localAdminManageUserRule.canActivate?.({
        body: { canManageMessageSuspension: true },
      }),
    ).toBe(false)
    expect(
      localAdminManageUserRule.canActivate?.({
        body: { canManageMessageSuspension: false },
      }),
    ).toBe(false)
    expect(
      localAdminManageUserRule.canActivate?.({
        body: { canManageServiceInterruptionBanner: true },
      }),
    ).toBe(false)
    expect(
      localAdminManageUserRule.canActivate?.({
        body: { canManageServiceInterruptionBanner: false },
      }),
    ).toBe(false)
  })
})

