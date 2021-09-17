import { ApolloClient } from '@apollo/client/core'
import { InMemoryCache, NormalizedCacheObject } from '@apollo/client/cache'
import getConfig from 'next/config'
import { BatchHttpLink } from '@apollo/client/link/batch-http'
import { Locale } from '@island.is/shared/types'
import { defaultLanguage } from '@island.is/shared/constants'

import possibleTypes from './fragmentTypes.json'

const { publicRuntimeConfig, serverRuntimeConfig } = getConfig()
const isBrowser: boolean = process.browser

let apolloClient: ApolloClient<NormalizedCacheObject> | null = null

let currentClientLocale = defaultLanguage

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
  const graphqlUrl = graphqlServerUrl || graphqlClientUrl
  const graphqlEndpoint = graphqlServerEndpoint || graphqlClientEndpoint
  const httpLink = new BatchHttpLink({
    uri: `${graphqlUrl}${graphqlEndpoint}`,
    useGETForQueries: true,
  })

  // Check out https://github.com/zeit/next.js/pull/4611 if you want to use the AWSAppSyncClient
  return new ApolloClient({
    name: 'cms-web-client',
    version: '0.1',
    connectToDevTools: isBrowser,
    ssrMode: !isBrowser, // Disables forceFetch on the server (so queries are only run once)
    link: httpLink,
    cache: new InMemoryCache(possibleTypes).restore(initialState || {}),
  })
}

export default function initApollo(initialState?: any, clientLocale?: Locale) {
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
  if (currentClientLocale !== clientLocale) {
    currentClientLocale = clientLocale
    apolloClient = create(initialState)
  }

  return apolloClient
}
