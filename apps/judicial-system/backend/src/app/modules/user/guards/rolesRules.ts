import { RolesRule, RulesType } from '@island.is/judicial-system/auth'
import { UserRole } from '@island.is/judicial-system/types'

// Allows local admins to manage users, but not to change the message
// suspension management capability - only the super admin may set that flag
export const localAdminManageUserRule: RolesRule = {
  role: UserRole.LOCAL_ADMIN,
  type: RulesType.BASIC,
  canActivate: (request) =>
    request.body?.canManageMessageSuspension === undefined,
}
