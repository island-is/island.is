import { User } from '@island.is/auth-nest-tools'
import {
  CreateCustomDelegation,
  CreateDomain,
} from '@island.is/services/auth/testing'

export interface DomainAssertion {
  name: string
  scopes: Array<{ name: string }>
}

export interface TestCase {
  user: User
  delegations?: CreateCustomDelegation[]
  accessTo?: string[]
  domains: CreateDomain[]
  expected: DomainAssertion[]
  query?: Record<string, string | string[]>
}
