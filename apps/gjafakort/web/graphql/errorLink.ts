import { ApolloError } from 'apollo-client'
import Router from 'next/router'
import { onError, ErrorResponse } from 'apollo-link-error'
import { ServerError } from 'apollo-link-http-common'

import { NotificationService, api } from '../services'

export default onError(
  ({ graphQLErrors, networkError, response }: ErrorResponse) => {
    if (response) {
      response.errors = undefined
    }

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
  },
)
