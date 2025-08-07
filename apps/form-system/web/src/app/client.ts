import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
} from '@apollo/client'
import { onError } from '@apollo/client/link/error'
import { RetryLink } from '@apollo/client/link/retry'
import fetch from 'cross-fetch'

const retryLink = new RetryLink()

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.map(({ message, path, extensions }) => {
      const problem = JSON.stringify(extensions?.problem, null, '  ')
      console.log(
        `[GraphQL error]: Message: ${message}, Path: ${path}, Problem: ${problem}`,
      )
      return ''
    })

  if (networkError) console.log(`[Network error]: ${networkError}`)
})

const httpLink = new HttpLink({
  uri: ({ operationName }) => `/bff/api/graphql?op=${operationName}`,
  fetch,
})

export const client = new ApolloClient({
  link: ApolloLink.from([retryLink, errorLink, httpLink]),
  cache: new InMemoryCache(),
})
