import ApolloClient from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { MOCK_AUTH_KEY } from '@island.is/service-portal/constants'
import Cookies from 'js-cookie'
import { setContext } from 'apollo-link-context'
import { createHttpLink } from 'apollo-link-http'
import fetch from 'isomorphic-unfetch'
import { ApolloLink } from 'apollo-link'

const httpLink = createHttpLink({
  uri: '/api/graphql',
  credentials: 'include',
  fetch,
})

const authLink = setContext((_, { headers }) => {
  const token = Cookies.get(MOCK_AUTH_KEY)
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  }
})

const client = new ApolloClient({
  name: 'service-portal',
  version: '0.1',
  link: ApolloLink.from([authLink, httpLink]),
  cache: new InMemoryCache(),
})

export default client
