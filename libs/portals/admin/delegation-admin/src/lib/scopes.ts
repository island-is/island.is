import { AdminPortalScope } from '@island.is/auth/scopes'

const adminScopes: string[] = [
  AdminPortalScope.delegationSystem,
  AdminPortalScope.delegationSystemAdmin,
]

export const allowedScopes: string[] = [
  ...adminScopes,
  AdminPortalScope.delegationSystemInstitution,
]

/** Admin scopes take precedence over the institution scope. */
export const hasDelegationAdminAccess = (scopes: string[]) =>
  scopes.some((scope) => adminScopes.includes(scope))
