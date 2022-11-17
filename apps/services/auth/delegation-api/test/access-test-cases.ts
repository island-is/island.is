import {
  createCurrentUser,
  createNationalId,
} from '@island.is/testing/fixtures'
import { AuthScope } from '@island.is/auth/scopes'
import { User } from '@island.is/auth-nest-tools'
import { ConfigType } from '@island.is/nest/config'
import { DelegationConfig, DelegationDirection } from '@island.is/auth-api-lib'
import { CreateCustomDelegation, CreateDomain } from './fixtures/types'
import { AuthDelegationType } from 'delegation'

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
  expectedDomains?: DomainAssertion[]
  direction?: DelegationDirection
}

const personUser = createCurrentUser({
  nationalIdType: 'person',
  scope: [AuthScope.delegations],
})

export const accessTestCases: Record<string, TestCase> = {
  // Normal user should be able to grant delegations for scopes allowing explicit delegation grants.
  happyCase: {
    direction: DelegationDirection.OUTGOING,
    user: personUser,
    domains: [
      {
        name: 'd1',
        apiScopes: [
          {
            name: 's1',
            allowExplicitDelegationGrant: true,
          },
        ],
      },
    ],
    expected: [
      {
        name: 'd1',
        scopes: [
          {
            name: 's1',
          },
        ],
      },
    ],
  },
  // Should not see scopes unless they allow explicit delegation grants.
  noExplicitDelegationGrant: {
    direction: DelegationDirection.OUTGOING,
    user: personUser,
    domains: [
      {
        name: 'd1',
        apiScopes: [
          {
            name: 's1',
            allowExplicitDelegationGrant: false,
          },
        ],
      },
    ],
    expected: [],
  },
  // Procuring holder should only see scopes they have access to.
  procuringHolderScopes: {
    direction: DelegationDirection.OUTGOING,
    user: createCurrentUser({
      nationalIdType: 'company',
      delegationType: AuthDelegationType.ProcurationHolder,
      scope: [AuthScope.delegations],
    }),
    domains: [
      {
        name: 'd1',
        apiScopes: [
          {
            name: 's1',
            allowExplicitDelegationGrant: true,
            grantToProcuringHolders: true,
          },
          {
            name: 's2',
            allowExplicitDelegationGrant: true,
            grantToProcuringHolders: false,
          },
          {
            name: 's3',
            allowExplicitDelegationGrant: false,
            grantToProcuringHolders: true,
          },
        ],
      },
    ],
    expected: [
      {
        name: 'd1',
        scopes: [
          {
            name: 's1',
          },
        ],
      },
    ],
  },
  // Can grant forward custom delegations which you have.
  customDelegationScopes: {
    direction: DelegationDirection.OUTGOING,
    user: createCurrentUser({
      nationalIdType: 'company',
      delegationType: AuthDelegationType.Custom,
      scope: [AuthScope.delegations],
    }),
    delegations: [
      {
        domainName: 'd1',
        scopes: [
          {
            scopeName: 's1',
          },
          {
            scopeName: 's2',
          },
        ],
      },
    ],
    domains: [
      {
        name: 'd1',
        apiScopes: [
          {
            name: 's1',
            allowExplicitDelegationGrant: true,
          },
          {
            name: 's2',
            allowExplicitDelegationGrant: false,
          },
        ],
      },
    ],
    expected: [
      {
        name: 'd1',
        scopes: [
          {
            name: 's1',
          },
        ],
      },
    ],
  },
  // Custom delegations should not leak between users.
  unrelatedCustomDelegations: {
    user: createCurrentUser({
      nationalIdType: 'company',
      delegationType: AuthDelegationType.Custom,
      scope: [AuthScope.delegations],
    }),
    delegations: [
      {
        domainName: 'd1',
        fromNationalId: createNationalId('company'),
        scopes: [
          {
            scopeName: 's1',
          },
        ],
      },
    ],
    domains: [
      {
        name: 'd1',
        apiScopes: [
          {
            name: 's1',
            allowExplicitDelegationGrant: true,
          },
        ],
      },
    ],
    expected: [],
    expectedDomains: [
      {
        name: 'd1',
        scopes: [{ name: 's1' }],
      },
    ],
  },
  // Company actor should not see access controlled scopes except as procuration holder or custom delegation.
  accessControlledCompanyScopes: {
    direction: DelegationDirection.OUTGOING,
    user: createCurrentUser({
      nationalIdType: 'company',
      scope: [AuthScope.delegations],
      delegationType: [
        AuthDelegationType.ProcurationHolder,
        AuthDelegationType.Custom,
      ],
    }),
    accessTo: ['s1', 's2', 's3'],
    delegations: [
      {
        domainName: 'd1',
        scopes: [{ scopeName: 's2' }],
      },
    ],
    domains: [
      {
        name: 'd1',
        apiScopes: [
          {
            name: 's1',
            allowExplicitDelegationGrant: true,
            grantToProcuringHolders: true,
            isAccessControlled: true,
          },
          {
            name: 's2',
            allowExplicitDelegationGrant: true,
            isAccessControlled: true,
          },
          {
            name: 's3',
            allowExplicitDelegationGrant: true,
            isAccessControlled: true,
          },
        ],
      },
    ],
    expected: [
      {
        name: 'd1',
        scopes: [{ name: 's1' }, { name: 's2' }],
      },
    ],
  },
  // Should see scopes configured for specific types of delegation.
  customScopeRulesIncluded: {
    direction: DelegationDirection.OUTGOING,
    user: createCurrentUser({
      nationalIdType: 'company',
      scope: [AuthScope.delegations],
      delegationType: [
        AuthDelegationType.ProcurationHolder,
        AuthDelegationType.Custom,
      ],
    }),
    customScopeRules: [
      { scopeName: 's1', onlyForDelegationType: ['ProcurationHolder'] },
      { scopeName: 's2', onlyForDelegationType: ['Custom'] },
      { scopeName: 's3', onlyForDelegationType: ['LegalGuardian'] },
      { scopeName: 's4', onlyForDelegationType: ['PersonalRepresentative'] },
    ],
    domains: [
      {
        name: 'd1',
        apiScopes: [
          { name: 's1', allowExplicitDelegationGrant: true },
          { name: 's2', allowExplicitDelegationGrant: true },
          { name: 's3', allowExplicitDelegationGrant: true },
          { name: 's4', allowExplicitDelegationGrant: true },
        ],
      },
    ],
    delegations: [
      {
        domainName: 'd1',
        scopes: [
          { scopeName: 's1' },
          { scopeName: 's2' },
          { scopeName: 's3' },
          { scopeName: 's4' },
        ],
      },
    ],
    expected: [
      {
        name: 'd1',
        scopes: [{ name: 's1' }, { name: 's2' }],
      },
    ],
  },
  // Should not see scopes configured for other types of delegation.
  customScopeRulesExcluded: {
    direction: DelegationDirection.OUTGOING,
    user: personUser,
    customScopeRules: [
      { scopeName: 's1', onlyForDelegationType: ['ProcurationHolder'] },
      { scopeName: 's2', onlyForDelegationType: ['Custom'] },
      { scopeName: 's3', onlyForDelegationType: ['LegalGuardian'] },
      { scopeName: 's4', onlyForDelegationType: ['PersonalRepresentative'] },
    ],
    domains: [
      {
        name: 'd1',
        apiScopes: [
          { name: 's1', allowExplicitDelegationGrant: true },
          { name: 's2', allowExplicitDelegationGrant: true },
          { name: 's3', allowExplicitDelegationGrant: true },
          { name: 's4', allowExplicitDelegationGrant: true },
        ],
      },
    ],
    delegations: [
      {
        domainName: 'd1',
        scopes: [
          { scopeName: 's1' },
          { scopeName: 's2' },
          { scopeName: 's3' },
          { scopeName: 's4' },
        ],
      },
    ],
    expected: [],
  },
  // Should get list of domains the user has access to grant outgoing delegations.
  onlyOutgoingDomains: {
    direction: DelegationDirection.OUTGOING,
    user: personUser,
    delegations: [
      // Incoming delegation on a company scope, domain should not be listed in outgoing domains.
      {
        domainName: 'd2',
        fromNationalId: createNationalId('company'),
        toNationalId: personUser.nationalId,
        scopes: [{ scopeName: 's2' }],
      },
    ],
    customScopeRules: [
      { scopeName: 's2', onlyForDelegationType: ['ProcurationHolder'] },
    ],
    domains: [
      {
        name: 'd1',
        apiScopes: [{ name: 's1', allowExplicitDelegationGrant: true }],
      },
      {
        name: 'd2',
        apiScopes: [{ name: 's2', allowExplicitDelegationGrant: true }],
      },
    ],
    expected: [
      {
        name: 'd1',
        scopes: [{ name: 's1' }],
      },
    ],
  },
}
