import fetch from 'cross-fetch'
import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
} from '@apollo/client'

import { RetryLink } from '@apollo/client/link/retry'
import { onError } from '@apollo/client/link/error'

const httpLink = new HttpLink({
  uri: ({ operationName }) => `/minarsidur/bff/api/graphql?op=${operationName}`,
  fetch,
  credentials: 'include',
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
  link: ApolloLink.from([retryLink, errorLink, httpLink]),
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
