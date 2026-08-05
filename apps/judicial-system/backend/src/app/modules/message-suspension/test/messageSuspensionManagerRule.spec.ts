import { RulesType } from '@island.is/judicial-system/auth'
import { type User, UserRole } from '@island.is/judicial-system/types'

import { messageSuspensionManagerRule } from '../guards/rolesRules'

describe('messageSuspensionManagerRule', () => {
  if (typeof messageSuspensionManagerRule === 'string') {
    throw new Error('Expected a rule object')
  }

  const rule = messageSuspensionManagerRule

  const requestFor = (user?: Partial<User>) => ({
    user: { currentUser: user as User },
  })

  it('should gate the local admin role with a basic rule', () => {
    expect(rule.role).toBe(UserRole.LOCAL_ADMIN)
    expect(rule.type).toBe(RulesType.BASIC)
  })

  it('should allow a local admin with the capability', () => {
    expect(
      rule.canActivate?.(requestFor({ canManageMessageSuspension: true })),
    ).toBe(true)
  })

  it('should deny a local admin without the capability', () => {
    expect(
      rule.canActivate?.(requestFor({ canManageMessageSuspension: false })),
    ).toBe(false)
  })

  it('should deny when there is no current user', () => {
    expect(rule.canActivate?.(requestFor(undefined))).toBe(false)
  })
})
