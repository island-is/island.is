import { InMemoryCache, NormalizedCacheObject } from 'apollo-cache-inmemory'
import { ApolloClient } from 'apollo-client'
import getConfig from 'next/config'
import { BatchHttpLink } from 'apollo-link-batch-http'
import fetch from 'isomorphic-unfetch'

const { publicRuntimeConfig, serverRuntimeConfig } = getConfig()

const isBrowser: boolean = process.browser

let apolloClient: ApolloClient<NormalizedCacheObject> | null = null

// Polyfill fetch() on the server (used by apollo-client)
if (!isBrowser) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ;(global as any).fetch = fetch
}

function create(initialState?: any) {
  // handle server vs client side calls
  const {
    graphqlUrl: graphqlServerUrl,
    graphqlEndpoint: graphqlServerEndpoint,
  } = serverRuntimeConfig
  const {
    graphqlUrl: graphqlClientUrl,
    graphqlEndpoint: graphqlClientEndpoint,
  } = publicRuntimeConfig
  const uri = `${graphqlServerUrl || graphqlClientUrl}${graphqlServerEndpoint ||
    graphqlClientEndpoint}`
  const httpLink = new BatchHttpLink({ uri })

  // Check out https://github.com/zeit/next.js/pull/4611 if you want to use the AWSAppSyncClient
  return new ApolloClient({
    name: 'cms-web-client',
    version: '0.1',
    connectToDevTools: isBrowser,
    ssrMode: !isBrowser, // Disables forceFetch on the server (so queries are only run once)
    link: httpLink,
    cache: new InMemoryCache().restore(initialState || {}),
  })
}

export default function initApollo(initialState?: any) {
  // Make sure to create a new client for every server-side request so that data
  // isn't shared between connections (which would be bad)
  if (!isBrowser) {
    return create(initialState)
  }

  // Reuse client on the client-side
  if (!apolloClient) {
    apolloClient = create(initialState)
  }

  return apolloClient
}
