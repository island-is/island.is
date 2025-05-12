import { RetryLink } from '@apollo/client/link/retry'
import { onError } from '@apollo/client/link/error'
import fetch from 'cross-fetch'
import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  ApolloLink,
} from '@apollo/client'

const retryLink = new RetryLink()

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.forEach(({ message, path, extensions }) => {
      const problem = JSON.stringify(extensions?.problem, null, '  ')
      console.log(
        `[GraphQL error]: Message: ${message}, Path: ${path}, Problem: ${problem}`,
      )
    })

  if (networkError) console.log(`[Network error]: ${networkError}`)
})

export const initializeClient = (baseApiUrl: string) => {
  const httpLink = new HttpLink({
    uri: ({ operationName }) => `${baseApiUrl}/api/graphql/${operationName}`,
    fetch,
  })

  return new ApolloClient({
    link: ApolloLink.from([retryLink, errorLink, httpLink]),
    cache: new InMemoryCache(),
  })
}
