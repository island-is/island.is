import { ApolloError } from 'apollo-client'
import Router from 'next/router'
import { onError, ErrorResponse } from 'apollo-link-error'
import { ServerError } from 'apollo-link-http-common'

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
        case 'CONFIRM_CODE_ERROR':
          break
        default:
          return NotificationService.onGraphQLError({
            graphQLErrors,
          } as ApolloError)
      }
    })
  }
})
