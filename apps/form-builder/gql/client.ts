import {
  ApolloClient,
  ApolloLink,
  InMemoryCache,
  NormalizedCacheObject,
} from '@apollo/client'
import httpLink from './httpLink'
import retryLink from './retryLink'

const isBrowser: boolean = process.browser

let apolloClient: ApolloClient<NormalizedCacheObject> | null = null

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function create(initialState?: any) {
  const link = ApolloLink.from([retryLink, httpLink]) // Add retry, error, auth and httpLink here

  return new ApolloClient({
    name: 'form-builder',
    version: '0.1',
    connectToDevTools: isBrowser,
    ssrMode: !isBrowser,
    link,
    cache: new InMemoryCache().restore(initialState || {}),
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': 'true',
    },
  })
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function initApollo(initialState?: any) {
  if (!isBrowser) {
    return create(initialState)
  }

  if (!apolloClient) {
    apolloClient = create(initialState)
  }

  return apolloClient
}
