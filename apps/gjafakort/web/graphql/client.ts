import { ApolloClient } from 'apollo-client'
import { ApolloLink } from 'apollo-link'
import {
  InMemoryCache,
  IntrospectionFragmentMatcher,
} from 'apollo-cache-inmemory'

import authLink from './authLink'
import errorLink from './errorLink'
import httpLink from './httpLink'
import retryLink from './retryLink'

import introspectionQueryResultData from './possibleTypes.json'

const link = ApolloLink.from([retryLink, errorLink, authLink, httpLink])

export const cache = new InMemoryCache({
  fragmentMatcher: new IntrospectionFragmentMatcher({
    introspectionQueryResultData,
  }),
})

const client = new ApolloClient({
  name: 'gjafakort-web-client',
  version: '0.1',
  link,
  cache,
})

export default client
