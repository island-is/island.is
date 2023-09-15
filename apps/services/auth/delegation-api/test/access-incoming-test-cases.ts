import { AuthScope } from '@island.is/auth/scopes'
import {
  createCurrentUser,
  createNationalId,
} from '@island.is/testing/fixtures'
import { TestCase } from './types'

const currentUser = createCurrentUser({
  nationalIdType: 'person',
  scope: [AuthScope.delegations],
})

export const accessIncomingTestCases: Record<string, TestCase> = {
  // Normal user should see delegations granted to them.
  happyCase: {
    user: currentUser,
    delegations: [
      {
        domainName: 'd1',
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
  noDelegation: {
    user: currentUser,
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
  },
  // User should not see scope that is no longer supported for custom delegations.
  notAllowedScope: {
    user: currentUser,
    delegations: [
      {
        domainName: 'd1',
        scopes: [{ scopeName: 's1' }, { scopeName: 's2' }],
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
        scopes: [{ name: 's1' }],
      },
    ],
  },
  // Custom delegations should not leak between users.
  unrelatedDelegation: {
    user: createCurrentUser({
      nationalIdType: 'person',
      scope: [AuthScope.delegations],
    }),
    delegations: [
      {
        domainName: 'd1',
        toNationalId: createNationalId('person'),
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
  },
}
