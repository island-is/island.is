import fetch from 'cross-fetch'
import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  ApolloLink,
} from '@apollo/client'
import { onError } from '@apollo/client/link/error'
import { RetryLink } from '@apollo/client/link/retry'

const httpLink = new HttpLink({
  uri: ({ operationName }) => `/stjornbord/bff/api/graphql?op=${operationName}`,
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
      AuthProcuringHolderDelegation: {
        keyFields: ['from', ['nationalId']],
      },
      AuthLegalGuardianDelegation: {
        keyFields: ['from', ['nationalId']],
      },
      AuthDelegationsGroupedByIdentity: {
        keyFields: ['nationalId', 'type'],
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
      AuthAdminClientEnvironment: {
        fields: {
          secrets: {
            merge(_, incoming) {
              return incoming
            },
          },
        },
      },
    },
  }),
})
