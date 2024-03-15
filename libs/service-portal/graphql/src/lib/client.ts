import fetch from 'cross-fetch'
import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
} from '@apollo/client'

import { RetryLink } from '@apollo/client/link/retry'
import { onError } from '@apollo/client/link/error'
import { authLink } from '@island.is/auth/react'
import { getStaticEnv } from '@island.is/shared/utils'

const uri =
  getStaticEnv('SI_PUBLIC_GRAPHQL_API') ?? 'http://localhost:4444/api/graphql'

const httpLink = new HttpLink({
  uri: ({ operationName }) => `${uri}?op=${operationName}`,
  fetch,
})

const retryLink = new RetryLink()

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.map(({ message, locations, path }) =>
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
      ),
    )

  if (networkError) console.log(`[Network error]: ${networkError}`)
})

export const client = new ApolloClient({
  link: ApolloLink.from([retryLink, errorLink, authLink, httpLink]),
  cache: new InMemoryCache({
    typePolicies: {
      UserProfile: {
        keyFields: ['nationalId'],
      },
      NationalRegistryPerson: {
        keyFields: ['nationalId'],
      },
      AuthProcuringHolderDelegation: {
        keyFields: ['from', ['nationalId']],
      },
      AuthLegalGuardianDelegation: {
        keyFields: ['from', ['nationalId']],
      },
      Query: {
        fields: {
          authDelegations: {
            merge(_, incoming) {
              return incoming
            },
          },
        },
      },
    },
  }),
})
