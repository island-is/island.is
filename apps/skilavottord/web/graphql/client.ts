import {
  ApolloClient,
  ApolloLink,
  InMemoryCache,
  NormalizedCacheObject,
} from '@apollo/client'

import { isBrowser } from '../utils'
import authLink from './authLink'
import errorLink from './errorLink'
import httpLink from './httpLink'
import retryLink from './retryLink'
import { possibleTypes } from './possibleTypes.json'

let apolloClient: ApolloClient<NormalizedCacheObject> | null = null

const createClient = (initialState): ApolloClient<NormalizedCacheObject> => {
  const link = ApolloLink.from([retryLink, errorLink, authLink, httpLink])

  const cache = new InMemoryCache({
    possibleTypes,
  }).restore(initialState || {})

  return new ApolloClient<NormalizedCacheObject>({
    name: 'skilavottord-web-client',
    version: '0.1',
    connectToDevTools: isBrowser,
    ssrMode: !isBrowser, // Disables forceFetch on the server (so queries are only run once)
    link,
    cache,
  })
}

const initApollo = (initialState): ApolloClient<NormalizedCacheObject> => {
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
