import ApolloClient from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { MOCK_AUTH_KEY } from '@island.is/service-portal/constants'
import Cookies from 'js-cookie'
import { setContext } from 'apollo-link-context'
import { createHttpLink } from 'apollo-link-http'
import fetch from 'isomorphic-unfetch'
// import { onError, ErrorResponse } from 'apollo-link-error'
// import { ServerError } from 'apollo-link-http-common'
import { ApolloLink } from 'apollo-link'

// const logoutLink = onError(({ graphQLErrors, networkError }: ErrorResponse) => {
//   if (networkError) {
//     return console.error(networkError as ServerError)
//   }
// if (graphQLErrors) {
//   graphQLErrors.forEach((err) => {
//     switch (err.extensions.code) {
//       case 'UNAUTHENTICATED':
//         return api.logout().then(() => Router.reload())
//       case 'FORBIDDEN':
//         return Router.push('/404')
//       default:
//         return NotificationService.onGraphQLError({
//           graphQLErrors,
//         } as ApolloError)
//     }
//   })
// }
// })

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

export const client = new ApolloClient({
  name: 'service-portal',
  version: '0.1',
  link: ApolloLink.from([authLink, httpLink]),
  cache: new InMemoryCache(),
})
