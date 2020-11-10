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

const uri =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:4444/api/graphql'
    : '/api/graphql'

const httpLink = new HttpLink({
  uri,
  fetch,
})

let token = ''

export const setClientAuthToken = (value: string) => {
  console.log('setting token ', value)
  token = value
}

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

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  }
})

export const client = new ApolloClient({
  link: ApolloLink.from([retryLink, errorLink, authLink, httpLink]),
  cache: new InMemoryCache(),
})
