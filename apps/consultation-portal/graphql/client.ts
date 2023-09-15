import {
  ApolloClient,
  ApolloLink,
  InMemoryCache,
  NormalizedCacheObject,
} from '@apollo/client'
import getConfig from 'next/config'
import authLink from './authLink'
import httpLink from './httpLink'
import retryLink from './retryLink'
import errorLink from './errorLink'
const { publicRuntimeConfig, serverRuntimeConfig } = getConfig()
const isBrowser: boolean = process.browser

let apolloClient: ApolloClient<NormalizedCacheObject> | null = null

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
  // const graphqlUrl = graphqlServerUrl || graphqlClientUrl
  const graphqlEndpoint = graphqlServerEndpoint || graphqlClientEndpoint
  // const httpLink = new BatchHttpLink({ uri: `${graphqlEndpoint}`, credentials: "include" })
  const link = ApolloLink.from([retryLink, errorLink, authLink, httpLink])

  // Check out https://github.com/zeit/next.js/pull/4611 if you want to use the AWSAppSyncClient
  return new ApolloClient({
    name: 'consultation-portal-client',
    version: '0.1',
    connectToDevTools: isBrowser,
    ssrMode: !isBrowser, // Disables forceFetch on the server (so queries are only run once)
    link, //: httpLink,
    cache: new InMemoryCache().restore(initialState || {}),
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': 'true',
    },
  })
}
// export default client
export default function initApollo(initialState?: any) {
  // Make sure to create a new client for every server-side request so that data
  // isn't shared between connections (which would be bad)
  if (!isBrowser) {
    return create(initialState)
  }

  // Reuse client on the client-side
  if (!apolloClient) {
    apolloClient = create(initialState)
    return apolloClient
  }

  // Create new instance if client is changing language

  return apolloClient
}
