import fetch from 'isomorphic-unfetch'
import { createHttpLink } from '@apollo/client'

import {
  getPublicRuntimeEnv,
  getServerRuntimeEnv,
} from '@island.is/judicial-system-web/environments/runtimeEnvironment'
import { isServerSide } from '@island.is/next/utils'

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
