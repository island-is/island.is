import { AdminPortalScope } from './admin-portal.scope'

export enum AuthAdminScope {
  root = '@island.is/auth/admin:root',
  full = '@island.is/auth/admin:full',
}

export const idsAdminScopes = [
  AdminPortalScope.idsAdmin,
  AdminPortalScope.idsAdminSuperUser,
]
