import { RolesRule, RulesType } from '@island.is/judicial-system/auth'
import { User, UserRole } from '@island.is/judicial-system/types'

// Allows local admins who have been granted the capability to manage the
// service interruption banner. Super admins are always allowed via adminRule.
export const serviceInterruptionBannerManagerRule: RolesRule = {
  role: UserRole.LOCAL_ADMIN,
  type: RulesType.BASIC,
  canActivate: (request) => {
    const user: User = request.user?.currentUser

    return Boolean(user?.canManageServiceInterruptionBanner)
  },
}
