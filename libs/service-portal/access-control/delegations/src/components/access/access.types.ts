import { AuthApiScope, AuthApiScopeGroup } from '@island.is/api/schema'
import { AuthScopeTreeQuery } from '@island.is/service-portal/graphql'

export const GROUP_PREFIX = 'group'
export const SCOPE_PREFIX = 'scope'
export const AUTH_API_SCOPE_GROUP_TYPE = 'AuthApiScopeGroup'

type ScopeCustomFields = {
  model: string
}

export type ScopeTag = {
  displayName?: string
  validTo: Date
}

export type ScopeGroup = AuthApiScopeGroup & ScopeCustomFields
export type Scope = (AuthApiScope & ScopeCustomFields) | ScopeGroup
export type AuthScopeTree = AuthScopeTreeQuery['authScopeTree']

export type MappedScope = {
  name?: string
  validTo?: Date
  description?: string | null
}

export type AccessFormFields = {
  name: string
  validTo?: Date
  displayName?: string
}
