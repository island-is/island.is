import { createCurrentUser } from '@island.is/testing/fixtures'
import { AuthScope } from '@island.is/auth/scopes'
import { AuthDelegationType } from '@island.is/shared/types'

import { TestCase } from './types'

const currentUser = createCurrentUser({
  nationalIdType: 'person',
  scope: [AuthScope.delegations],
})

export const domainFiltersTestCases: Record<string, TestCase> = {
  'should return all domains with no filters': {
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
      {
        name: 'd2',
        apiScopes: [
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
      {
        name: 'd2',
        scopes: [
          {
            name: 's2',
          },
        ],
      },
    ],
  },
  'should filter by domain name when domainNames is provided': {
    user: currentUser,
    domains: [
      {
        name: 'd1',
        apiScopes: [
          {
            name: 's1',
          },
        ],
      },
      {
        name: 'd2',
        apiScopes: [
          {
            name: 's2',
            allowExplicitDelegationGrant: true,
          },
        ],
      },
      {
        name: 'd3',
        apiScopes: [
          {
            name: 's3',
          },
        ],
      },
    ],
    query: {
      domainName: ['d1', 'd2'],
    },
    expected: [
      {
        name: 'd1',
        scopes: [
          {
            name: 's1',
          },
        ],
      },
      {
        name: 'd2',
        scopes: [
          {
            name: 's2',
          },
        ],
      },
    ],
  },
  'should return only domains with delegation support when supportsDelegations is provided':
    {
      user: currentUser,
      domains: [
        {
          name: 'd1',
          apiScopes: [
            {
              name: 's1',
            },
          ],
        },
        {
          name: 'd2',
          apiScopes: [
            {
              name: 's2',
              allowExplicitDelegationGrant: true,
            },
          ],
        },
      ],
      query: {
        supportsDelegations: 'true',
      },
      expected: [
        {
          name: 'd2',
          scopes: [
            {
              name: 's2',
            },
          ],
        },
      ],
    },
  'should return only domains with outgoing delegation support when direction=outgoing is provided as an individual':
    {
      user: currentUser,
      domains: [
        {
          name: 'd1',
          apiScopes: [
            {
              name: 's1',
            },
          ],
        },
        {
          name: 'd2',
          apiScopes: [
            {
              name: 's2',
              allowExplicitDelegationGrant: true,
              grantToProcuringHolders: true,
            },
          ],
        },
        {
          name: 'd3',
          apiScopes: [
            {
              name: 's3',
              allowExplicitDelegationGrant: true,
              grantToAuthenticatedUser: false,
              grantToProcuringHolders: true,
            },
          ],
        },
      ],
      query: {
        direction: 'outgoing',
      },
      expected: [
        {
          name: 'd2',
          scopes: [
            {
              name: 's2',
            },
          ],
        },
      ],
    },
  'should return only domains with outgoing delegation support when direction=outgoing is provided as an company':
    {
      user: createCurrentUser({
        nationalIdType: 'company',
        scope: [AuthScope.delegations],
        delegationType: [
          AuthDelegationType.ProcurationHolder,
          AuthDelegationType.Custom,
        ],
      }),
      domains: [
        {
          name: 'd1',
          apiScopes: [
            {
              name: 's1',
            },
          ],
        },
        {
          name: 'd2',
          apiScopes: [
            {
              name: 's2',
              allowExplicitDelegationGrant: true,
              grantToProcuringHolders: true,
            },
          ],
        },
        {
          name: 'd3',
          apiScopes: [
            {
              name: 's3',
              allowExplicitDelegationGrant: true,
              grantToAuthenticatedUser: false,
              grantToProcuringHolders: true,
            },
          ],
        },
      ],
      query: {
        direction: 'outgoing',
      },
      expected: [
        {
          name: 'd2',
          scopes: [
            {
              name: 's2',
            },
          ],
        },
        {
          name: 'd3',
          scopes: [
            {
              name: 's3',
            },
          ],
        },
      ],
    },
}
