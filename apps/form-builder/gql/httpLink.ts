import { createHttpLink } from '@apollo/client'
import fetch from 'isomorphic-unfetch'

// Polyfill fetch() on the server (used by apollo-client)
if (!process.browser) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ;(global as any).fetch = fetch
}

export default createHttpLink({
  uri: 'https://profun.island.is/umsoknarkerfi/api/graphql', // Should be in next.config.js
  credentials: 'include',
  fetch,
})
