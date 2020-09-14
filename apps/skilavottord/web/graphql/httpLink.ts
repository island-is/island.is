import { createHttpLink } from '@apollo/client'
import getConfig from 'next/config'
import fetch from 'isomorphic-unfetch'

import { isBrowser } from '../utils'

const { publicRuntimeConfig, serverRuntimeConfig } = getConfig()

// Polyfill fetch() on the server (used by apollo-client)
if (!isBrowser) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ;(global as any).fetch = fetch
}

export default createHttpLink({
  // uri:
  //   serverRuntimeConfig.graphqlEndpoint || publicRuntimeConfig.graphqlEndpoint,
  uri: '/api/graphql',
  credentials: 'include',
  fetch,
})
