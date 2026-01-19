import { InMemoryCache, NormalizedCacheObject } from '@apollo/client/cache'
import { ApolloClient } from '@apollo/client/core'

import { defaultLanguage } from '@island.is/shared/constants'
import type { Locale } from '@island.is/shared/types'
import { createHttpLink } from '@island.is/web/graphql/httpLink'

import type { ScreenContext } from '../types'
import possibleTypes from './fragmentTypes.json'
import { type ClientOptions, optionsFromContext, optionsFromWindow } from './options'

const isBrowser: boolean = process.browser

let apolloClient: ApolloClient<NormalizedCacheObject> | null = null

let currentClientLocale = defaultLanguage

function create(initialState?: any, options: ClientOptions = {}) {
  const httpLink = createHttpLink(options)

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

export default function initApollo(
  initialState?: any,
  clientLocale?: Locale,
  ctx?: Partial<ScreenContext>,
) {
  // Make sure to create a new client for every server-side request so that data
  // isn't shared between connections (which would be bad)
  if (!isBrowser) {
    return create(initialState, optionsFromContext(ctx))
  }

  // Reuse client on the client-side
  if (!apolloClient) {
    apolloClient = create(initialState, optionsFromWindow())
    return apolloClient
  }

  // Create new instance if client is changing language
  if (currentClientLocale !== clientLocale) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore make web strict
    currentClientLocale = clientLocale
    apolloClient = create(initialState)
  }

  return apolloClient
}
