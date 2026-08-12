import { createHttpLink } from '@apollo/client'
import fetch from 'isomorphic-unfetch'

import { isBrowser } from '../utils'
import {
  getPublicRuntimeEnv,
  getServerRuntimeEnv,
} from '../environments/runtimeEnvironment'

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
