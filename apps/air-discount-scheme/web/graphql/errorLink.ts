import { ApolloError, ServerError } from '@apollo/client'
import { onError, ErrorResponse } from '@apollo/client/link/error'
import Router from 'next/router'

import { NotificationService, api } from '../services'

export default onError(({ graphQLErrors, networkError }: ErrorResponse) => {
  if (networkError) {
    return NotificationService.onNetworkError(networkError as ServerError)
  }

  if (graphQLErrors) {
    graphQLErrors.forEach((err) => {
      switch (err.extensions.code) {
        case 'UNAUTHENTICATED':
          return api.logout().then(() => Router.reload())
        case 'FORBIDDEN':
          return Router.push('/404')
        default:
          return NotificationService.onGraphQLError({
            graphQLErrors,
          } as ApolloError)
      }
    })
  }
})
