import fetch from 'isomorphic-unfetch'
import { createHttpLink } from '@apollo/client'

import { isServerSide } from '@island.is/shared/utils'

import {
  getPublicRuntimeEnv,
  getServerRuntimeEnv,
} from '../environments/runtimeEnvironment'

// Polyfill fetch() on the server (used by apollo-client)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
;(global as any).fetch = fetch

export default createHttpLink({
  uri: isServerSide()
    ? getServerRuntimeEnv().graphqlEndpoint
    : getPublicRuntimeEnv().graphqlEndpoint,
  credentials: 'include',
  fetch,
})
