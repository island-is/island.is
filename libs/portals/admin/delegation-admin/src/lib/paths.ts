export enum DelegationAdminPaths {
  Root = '/delegation-admin',
  DelegationAdmin = '/delegation-admin/:nationalId',
  CreateDelegation = '/delegation-admin/create',
}

/** Set on the root path when a lookup found no delegations. */
export const NOT_FOUND_PARAM = 'notFound'
