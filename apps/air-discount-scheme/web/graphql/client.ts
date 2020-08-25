import { ApolloClient } from 'apollo-client'
import { ApolloLink } from 'apollo-link'
import {
  InMemoryCache,
  IntrospectionFragmentMatcher,
  NormalizedCacheObject,
} from 'apollo-cache-inmemory'

import { isBrowser } from '../utils'
import authLink from './authLink'
import errorLink from './errorLink'
import httpLink from './httpLink'
import retryLink from './retryLink'
import introspectionQueryResultData from './possibleTypes.json'

let apolloClient: ApolloClient<NormalizedCacheObject> | null = null

const createClient = (initialState?: NormalizedCacheObject) => {
  const link = ApolloLink.from([retryLink, errorLink, authLink, httpLink])

  const cache = new InMemoryCache({
    fragmentMatcher: new IntrospectionFragmentMatcher({
      introspectionQueryResultData,
    }),
  }).restore(initialState || {})

  return new ApolloClient({
    name: 'air-discount-scheme-client',
    version: '0.1',
    connectToDevTools: isBrowser,
    ssrMode: !isBrowser, // Disables forceFetch on the server (so queries are only run once)
    link,
    cache,
  })
}

const initApollo = (initialState?: NormalizedCacheObject) => {
  // Make sure to create a new client for every server-side request so that data
  // isn't shared between connections (which would be bad)
  if (!isBrowser) {
    return createClient(initialState)
  }

  // Reuse client on the client-side
  if (!apolloClient) {
    apolloClient = createClient(initialState)
  }

  return apolloClient
}

export default initApollo
