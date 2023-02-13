import {
  ApolloClient,
  ApolloLink,
  createHttpLink,
  InMemoryCache,
} from '@apollo/client'
import getConfig from 'next/config'
// import authLink from './authLink'
// import errorLink from './errorLink'
// import httpLink from './httpLink'
// import retryLink from './retryLink'
import { onError } from '@apollo/client/link/error'
import { GraphQLError } from 'graphql'
import { graphQLResultHasError } from '@apollo/client/utilities'
const { publicRuntimeConfig, serverRuntimeConfig } = getConfig()

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.map(({ message, locations, path }) => {
      alert(`Graphql error ${message}`)
    })
  }
})
const httpLink = createHttpLink({
  uri: 'https://samradapi-test.island.is/api',
  useGETForQueries: true,
})
const link = ApolloLink.from([errorLink, httpLink])

const cache = new InMemoryCache({ possibleTypes: {} })

const client = new ApolloClient({
  name: 'consultation-portal-client',
  version: '0.1',
  link,
  cache,
})

export default client
