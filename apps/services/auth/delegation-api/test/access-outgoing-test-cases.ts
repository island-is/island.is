import { AuthScope } from '@island.is/auth/scopes'
import { AuthDelegationType } from '@island.is/shared/types'
import {
  createCurrentUser,
  createNationalId,
} from '@island.is/testing/fixtures'

import { TestCase } from './types'
import { CustomDelegationOnlyForDelegationType } from '@island.is/auth-api-lib'

const currentUser = createCurrentUser({
  nationalIdType: 'person',
  scope: [AuthScope.delegations],
})

export const accessOutgoingTestCases: Record<string, TestCase> = {
  // Normal user should be able to grant delegations for scopes allowing explicit delegation grants.
  happyCase: {
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
    user: currentUser,
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
  },
  // Company actor should not see access controlled scopes except as procuration holder or custom delegation.
  accessControlledCompanyScopes: {
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
  // customScopeRulesIncluded: {
  //   user: createCurrentUser({
  //     nationalIdType: 'company',
  //     scope: [AuthScope.delegations],
  //     delegationType: [AuthDelegationType.ProcurationHolder],
  //   }),
  //   domains: [
  //     {
  //       name: 'd1',
  //       apiScopes: [
  //         {
  //           name: 's1',
  //           allowExplicitDelegationGrant: true,
  //           customDelegationOnlyFor: [
  //             CustomDelegationOnlyForDelegationType.ProcurationHolder,
  //           ],
  //         },
  //         {
  //           name: 's2',
  //           allowExplicitDelegationGrant: true,
  //           customDelegationOnlyFor: [
  //             CustomDelegationOnlyForDelegationType.Custom,
  //           ],
  //         },
  //       ],
  //     },
  //   ],i
  //   delegations: [
  //     {
  //       domainName: 'd1',
  //       scopes: [{ scopeName: 's1' }, { scopeName: 's2' }],
  //     },
  //   ],
  //   expected: [
  //     {
  //       name: 'd1',
  //       scopes: [{ name: 's1' }],
  //     },
  //   ],
  // },
  // Should not see scopes configured for other types of delegation.
  customScopeRulesExcluded: {
    user: currentUser,
    domains: [
      {
        name: 'd1',
        apiScopes: [
          {
            name: 's1',
            allowExplicitDelegationGrant: true,
            customDelegationOnlyFor: [
              CustomDelegationOnlyForDelegationType.ProcurationHolder,
            ],
          },
          {
            name: 's2',
            allowExplicitDelegationGrant: true,
            customDelegationOnlyFor: [
              CustomDelegationOnlyForDelegationType.Custom,
            ],
          },
        ],
      },
    ],
    delegations: [
      {
        domainName: 'd1',
        scopes: [{ scopeName: 's1' }, { scopeName: 's2' }],
      },
    ],
    expected: [],
  },
  // Should get list of domains the user has access to grant outgoing delegations.
  onlyOutgoingDomains: {
    user: currentUser,
    delegations: [
      // Incoming delegation on a company scope, domain should not be listed in outgoing domains.
      {
        domainName: 'd2',
        fromNationalId: createNationalId('company'),
        toNationalId: currentUser.nationalId,
        scopes: [{ scopeName: 's2' }],
      },
    ],
    domains: [
      {
        name: 'd1',
        apiScopes: [{ name: 's1', allowExplicitDelegationGrant: true }],
      },
      {
        name: 'd2',
        apiScopes: [
          {
            name: 's2',
            allowExplicitDelegationGrant: true,
            customDelegationOnlyFor: [
              CustomDelegationOnlyForDelegationType.ProcurationHolder,
            ],
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
  // Should not see scopes that are not for the authenticated user.
  notForAuthenticatedUser: {
    user: currentUser,
    domains: [
      {
        name: 'd1',
        apiScopes: [
          {
            name: 's1',
            allowExplicitDelegationGrant: true,
            grantToAuthenticatedUser: false,
          },
        ],
      },
    ],
    expected: [],
  },
}
