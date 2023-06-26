import { AdminPortalScope } from './admin-portal.scope'

export enum AuthScope {
  actorDelegations = '@island.is/auth/actor-delegations',
  delegations = '@island.is/auth/delegations:write',
  adminPersonalRepresentative = '@island.is/auth/personal-representative-admin',
  publicPersonalRepresentative = '@island.is/auth/personal-representative-public',
  consents = '@island.is/auth/consents',
}

export const delegationScopes = [
  AuthScope.delegations,
  AdminPortalScope.delegations,
]
