import fetch from 'isomorphic-unfetch'
import getConfig from 'next/config'
import { createHttpLink } from '@apollo/client'

// TODO: Revisit this - Needed for jest tests to run because next config is not available during tests
const { publicRuntimeConfig = {}, serverRuntimeConfig = {} } = getConfig() ?? {}

// Polyfill fetch() on the server (used by apollo-client)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
;(global as any).fetch = fetch

export default createHttpLink({
  uri:
    serverRuntimeConfig.graphqlEndpoint ?? publicRuntimeConfig.graphqlEndpoint,
  credentials: 'include',
  fetch,
})
