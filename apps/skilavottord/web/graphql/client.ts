import { createHttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { ApolloClient } from 'apollo-client'
import fetch from 'isomorphic-fetch'

const gqlLink = createHttpLink({
  uri: 'http://localhost:4000/',
  fetch
})

const gqlCache = new InMemoryCache()

const client = new ApolloClient({
  name: 'skilavottord-web-client',
  link: gqlLink,
  cache: gqlCache
})

export default client