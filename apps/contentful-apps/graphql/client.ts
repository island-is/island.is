import getConfig from 'next/config'
import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client'

const { publicRuntimeConfig = {}, serverRuntimeConfig = {} } = getConfig() ?? {}

const isBrowser = typeof window !== 'undefined'

let apolloClient: ApolloClient<any> | null = null

export const createApolloClient = () =>
  new ApolloClient({
    name: 'contentful-apps-client',
    version: '0.1',
    ssrMode: !isBrowser,
    link: new HttpLink({
      uri:
        serverRuntimeConfig.graphqlEndpoint ||
        publicRuntimeConfig.graphqlEndpoint,
    }),
    cache: new InMemoryCache(),
  })

export const initApollo = () => {
  if (!isBrowser) {
    return createApolloClient()
  }
  if (!apolloClient) {
    apolloClient = createApolloClient()
  }
  return apolloClient
}
