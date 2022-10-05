import { AuthApiScope, AuthApiScopeGroup } from '@island.is/api/schema'
import { AuthDelegationScopeType } from '@island.is/service-portal/graphql'

export const GROUP_PREFIX = 'group'
export const SCOPE_PREFIX = 'scope'

type ApiScope = AuthApiScope & { model: string }
export type ApiScopeGroup = AuthApiScopeGroup & { model: string }
export type ScopeTag = {
  displayName?: string
  validTo: Date
}

export type Scope = ApiScope | ApiScopeGroup
export interface GroupedApiScopes {
  [_: string]: ApiScope[]
}

export type AccessForm = {
  [SCOPE_PREFIX]: {
    name: string[]
    validTo?: Date
    type: AuthDelegationScopeType
    displayName?: string
  }[]
}
