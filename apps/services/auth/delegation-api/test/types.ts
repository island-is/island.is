import { DelegationConfig } from '@island.is/auth-api-lib'
import { User } from '@island.is/auth-nest-tools'
import { ConfigType } from '@island.is/nest/config'

import { CreateCustomDelegation, CreateDomain } from './fixtures/types'

export interface TestEndpointOptions {
  method: string
  endpoint: string
}

export interface DomainAssertion {
  name: string
  scopes: Array<{ name: string }>
}

export interface TestCase {
  user: User
  customScopeRules?: ConfigType<typeof DelegationConfig>['customScopeRules']
  delegations?: CreateCustomDelegation[]
  accessTo?: string[]
  domains: CreateDomain[]
  expected: DomainAssertion[]
}
