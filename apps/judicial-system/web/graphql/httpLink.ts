import { createHttpLink } from '@apollo/client'
import fetch from 'isomorphic-unfetch'
import environment from '../src/environments/environment'

// Polyfill fetch() on the server (used by apollo-client)
// eslint-disable-next-line @typescript-eslint/no-explicit-any(global as any).fetch = fetch

export default createHttpLink({
  uri: `${environment.api.url}/api/graphql`,
  credentials: 'include',
  fetch,
})
