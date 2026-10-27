import { AdminPortalScope } from '@island.is/auth/scopes'

const adminScopes: string[] = [
  AdminPortalScope.delegationSystem,
  AdminPortalScope.delegationSystemAdmin,
]

export const allowedScopes: string[] = [
  ...adminScopes,
  AdminPortalScope.delegationSystemInstitution,
]

/**
 * Users with only the institution scope get the per-client overview of their
 * own organization instead of the national delegation lookup.
 */
export const hasDelegationAdminAccess = (scopes: string[]) =>
  scopes.some((scope) => adminScopes.includes(scope))
