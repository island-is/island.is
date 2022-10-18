import { AuthApiScope, AuthApiScopeGroup } from '@island.is/api/schema'

export const GROUP_PREFIX = 'group'
export const SCOPE_PREFIX = 'scope'

type ScopeCustomFields = {
  model: string
}
type ApiScope = AuthApiScope & ScopeCustomFields
export type ApiScopeGroup = AuthApiScopeGroup & ScopeCustomFields
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
    displayName?: string
  }[]
}
