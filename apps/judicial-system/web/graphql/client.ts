import { ApolloClient, ApolloLink, InMemoryCache } from '@apollo/client'

import authLink from './authLink'
import errorLink from './errorLink'
import httpLink from './httpLink'
import retryLink from './retryLink'

const link = ApolloLink.from([retryLink, errorLink, authLink, httpLink])

const cache = new InMemoryCache({
  possibleTypes: {},
})

const client = new ApolloClient({
  name: 'judicial-system-web-client',
  version: '0.1',
  link,
  cache,
})

export default client
