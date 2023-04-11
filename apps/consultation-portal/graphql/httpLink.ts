import { createHttpLink } from '@apollo/client'
import getConfig from 'next/config'
import fetch from 'isomorphic-unfetch'

const { publicRuntimeConfig, serverRuntimeConfig } = getConfig()

// Polyfill fetch() on the server (used by apollo-client)
if (!process.browser) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ;(global as any).fetch = fetch
}

export default createHttpLink({
  uri:
    serverRuntimeConfig.graphqlEndpoint || publicRuntimeConfig.graphqlEndpoint,
  credentials: 'include',
  fetch,
})
