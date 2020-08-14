import fetch from 'cross-fetch'
import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client'

const httpLink = new HttpLink({
  uri: 'http://localhost:4444/api/graphql',
  fetch,
})

export const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
})
