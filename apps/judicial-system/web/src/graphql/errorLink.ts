import { ApolloError, ServerError } from '@apollo/client'
import { onError, ErrorResponse } from '@apollo/client/link/error'

import { NotificationService, api } from '../services'

export default onError(({ graphQLErrors, networkError }: ErrorResponse) => {
  if (networkError) {
    return NotificationService.onNetworkError(networkError as ServerError)
  }

  if (graphQLErrors) {
    graphQLErrors.forEach((err) => {
      switch (err.extensions?.code) {
        case 'UNAUTHENTICATED':
          return api.logOut('?error=true')
        case 'FORBIDDEN':
          return
        default:
          return NotificationService.onGraphQLError({
            graphQLErrors,
          } as ApolloError)
      }
    })
  }
})
