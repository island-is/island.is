import { InMemoryCache, NormalizedCacheObject } from 'apollo-cache-inmemory'
import { ApolloClient } from 'apollo-client'
import { BaseContext } from 'next/dist/next-server/lib/utils'
import { createHttpLink } from 'apollo-link-http'
import fetch from 'isomorphic-unfetch'
import getConfig from 'next/config'

import { decodeToken } from '../auth'

const { serverRuntimeConfig, publicRuntimeConfig } = getConfig()

const isBrowser: boolean = (process as NodeJS.Process).browser

let apolloClient: ApolloClient<NormalizedCacheObject> | null = null

// Polyfill fetch() on the server (used by apollo-client)
if (!isBrowser) {
  ;(global as any).fetch = fetch // eslint-disable-line
}

// eslint-disable-next-line
function create(initialState: any, ctx?: BaseContext) {
  const token = decodeToken(ctx)
  const { headers = {} } = ctx?.req || {}
  if (token) {
    headers['X-CSRF-TOKEN'] = token.csrfToken
  }

  const httpLink = createHttpLink({
    uri: serverRuntimeConfig.apiUrl || publicRuntimeConfig.apiUrl,
    headers,
  })

  // Check out https://github.com/zeit/next.js/pull/4611 if you want to use the AWSAppSyncClient
  return new ApolloClient({
    connectToDevTools: isBrowser,
    ssrMode: !isBrowser, // Disables forceFetch on the server (so queries are only run once)
    link: httpLink,
    cache: new InMemoryCache().restore(initialState || {}),
  })
}

// eslint-disable-next-line
export default function initApollo(initialState?: any, ctx?: BaseContext) {
  // Make sure to create a new client for every server-side request so that data
  // isn't shared between connections (which would be bad)
  if (!isBrowser) {
    return create(initialState, ctx)
  }

  // Reuse client on the client-side
  if (!apolloClient) {
    apolloClient = create(initialState, ctx)
  }

  return apolloClient
}
