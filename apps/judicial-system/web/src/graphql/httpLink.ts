import { createHttpLink } from '@apollo/client'
import fetch from 'isomorphic-unfetch'

// Polyfill fetch() on the server (used by apollo-client)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
;(global as any).fetch = fetch

export default createHttpLink({
  uri: '/api/graphql',
  credentials: 'include',
  fetch,
})
