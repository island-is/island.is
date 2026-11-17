import { UserRole } from '@island.is/judicial-system/types'

import { serviceInterruptionBannerManagerRule } from '../guards/rolesRules'

describe('serviceInterruptionBannerManagerRule', () => {
  if (typeof serviceInterruptionBannerManagerRule === 'string') {
    throw new Error('Expected a rule object')
  }

  const rule = serviceInterruptionBannerManagerRule

  const requestFor = (user: { canManageServiceInterruptionBanner?: boolean }) =>
    ({
      user: { currentUser: { role: UserRole.LOCAL_ADMIN, ...user } },
    } as never)

  it('allows local admins with the banner management flag', () => {
    expect(
      rule.canActivate?.(
        requestFor({ canManageServiceInterruptionBanner: true }),
      ),
    ).toBe(true)
  })

  it('denies local admins without the banner management flag', () => {
    expect(
      rule.canActivate?.(
        requestFor({ canManageServiceInterruptionBanner: false }),
      ),
    ).toBe(false)
  })
})
