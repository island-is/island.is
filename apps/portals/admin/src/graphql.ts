import fetch from 'cross-fetch'
import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  ApolloLink,
} from '@apollo/client'
import { onError } from '@apollo/client/link/error'
import { RetryLink } from '@apollo/client/link/retry'
import { createBffUrlGenerator } from '@island.is/react-spa/bff'
import { AdminPortalPaths } from './lib/paths'

const bffUrlGenerator = createBffUrlGenerator(AdminPortalPaths.Base)

const uri = bffUrlGenerator('/api/graphql')

const httpLink = new HttpLink({
  uri: ({ operationName }) => `${uri}?op=${operationName}`,
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
