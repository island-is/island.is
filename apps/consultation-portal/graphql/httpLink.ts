import { createHttpLink } from '@apollo/client'
import fetch from 'isomorphic-unfetch'
import {
  getPublicRuntimeEnv,
  getServerRuntimeEnv,
} from '../environments/runtimeEnvironment'

const isBrowser: boolean = process.browser

// Polyfill fetch() on the server (used by apollo-client)
if (!isBrowser) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ;(global as any).fetch = fetch
}

export default createHttpLink({
  uri: isBrowser
    ? getPublicRuntimeEnv().graphqlEndpoint
    : getServerRuntimeEnv().graphqlEndpoint,
  credentials: 'include',
  fetch,
})
