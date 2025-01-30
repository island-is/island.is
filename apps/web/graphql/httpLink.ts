import sha256 from 'crypto-js/sha256'
import getConfig from 'next/config'
import { ApolloLink } from '@apollo/client'
import { BatchHttpLink } from '@apollo/client/link/batch-http'
import { HttpLink } from '@apollo/client/link/http'
import { createPersistedQueryLink } from '@apollo/client/link/persisted-queries'

import { ClientOptions } from './options'

const { publicRuntimeConfig = {}, serverRuntimeConfig = {} } = getConfig() ?? {}

// Only import and use enhanced fetch on the server.
// This is mainly to enable connection pooling from NextJS server to GraphQL API.
export let fetch = undefined
if (process.env.RUNTIME_ENV === 'server') {
  import('@island.is/clients/middlewares').then(
    ({ createEnhancedFetch }) =>
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore make web strict
      (fetch = createEnhancedFetch({
        name: 'islandis-api',
        timeout: false,
        circuitBreaker: false,
      })),
  )
}

const createBypassCacheLink = (options: ClientOptions) =>
  new ApolloLink((operation, forward) => {
    if (options.bypassCache) {
      operation.setContext(({ headers = {} }) => ({
        headers: {
          ...headers,
          'x-bypass-cache': options.bypassCache,
        },
      }))
    }
    return forward(operation)
  })

export function createHttpLink(options: ClientOptions) {
  if (typeof window !== 'undefined') {
    // Use hashed GET queries on the client side to enable CDN caching of GraphQL queries.
    const { graphqlUrl, graphqlEndpoint } = publicRuntimeConfig
    return createPersistedQueryLink({
      sha256: (query) => sha256(query).toString(),
      useGETForHashedQueries: true,
    })
      .concat(createBypassCacheLink(options))
      .concat(new HttpLink({ uri: `${graphqlUrl}${graphqlEndpoint}`, fetch }))
  } else {
    // Use batched POST requests on the server side to reduce the number of
    // outgoing requests and CPU needed for run-time hashing.
    const { graphqlUrl, graphqlEndpoint } = serverRuntimeConfig
    return createBypassCacheLink(options).concat(
      new BatchHttpLink({
        uri: `${graphqlUrl}${graphqlEndpoint}`,
        fetch,
      }),
    )
  }
}
