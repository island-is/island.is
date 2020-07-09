import ApolloClient from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { HttpLink } from 'apollo-link-http'
import { MOCK_AUTH_KEY } from '@island.is/service-portal/constants'

export const createApolloClient = () => {
  const token = localStorage[MOCK_AUTH_KEY] || ''
  return new ApolloClient({
    link: new HttpLink({
      uri: 'bla',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
    cache: new InMemoryCache(),
  })
}
