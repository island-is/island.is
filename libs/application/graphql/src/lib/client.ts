import fetch from 'cross-fetch'
import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  ApolloLink,
} from '@apollo/client'
import { onError } from '@apollo/client/link/error'
import { RetryLink } from '@apollo/client/link/retry'
import { setContext } from '@apollo/client/link/context'
import { userManager } from '../../../../../apps/application-system/form/src/utils/userManager'

const httpLink = new HttpLink({
  uri: 'http://localhost:4444/api/graphql',
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

const authLink = setContext(async (_, { headers }) => {
  const user = await userManager.getUser()

  return {
    headers: {
      ...headers,
      authorization: user?.access_token ? `Bearer ${user?.access_token}` : '',
    },
  }
})

export const client = new ApolloClient({
  link: ApolloLink.from([retryLink, errorLink, authLink, httpLink]),
  cache: new InMemoryCache(),
})
