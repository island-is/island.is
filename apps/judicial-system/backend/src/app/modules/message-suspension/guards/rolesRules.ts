import { RolesRule, RulesType } from '@island.is/judicial-system/auth'
import { User, UserRole } from '@island.is/judicial-system/types'

// Allows local admins who have been granted the capability to manage message
// suspensions. Super admins are always allowed via the adminRule, so this rule
// only needs to gate the local admin role on the canManageMessageSuspension flag.
export const messageSuspensionManagerRule: RolesRule = {
  role: UserRole.LOCAL_ADMIN,
  type: RulesType.BASIC,
  canActivate: (request) => {
    const user: User = request.user?.currentUser

    return Boolean(user?.canManageMessageSuspension)
  },
}
