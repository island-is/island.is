import { createHttpLink } from 'apollo-link-http'
import fetch from 'isomorphic-unfetch'

const isBrowser: boolean = process.browser

// Polyfill fetch() on the server (used by apollo-client)
if (!isBrowser) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ;(global as any).fetch = fetch
}

export default createHttpLink({
  uri: 'http://localhost:4444/graphql',
})
