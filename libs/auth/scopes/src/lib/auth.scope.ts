import { AdminPortalScope } from './admin-portal.scope'

export enum AuthScope {
  actorDelegations = '@island.is/auth/actor-delegations',
  delegations = '@island.is/auth/delegations:write',
  adminPersonalRepresentative = '@island.is/auth/personal-representative-admin',
  publicPersonalRepresentative = '@island.is/auth/personal-representative-public',
  consents = '@island.is/auth/consents',
  delegationIndexWrite = '@island.is/auth/delegations/index:write',
  delegationIndex = '@island.is/auth/delegations/index',
}

export const delegationScopes = [
  AuthScope.delegations,
  AdminPortalScope.delegations,
]
