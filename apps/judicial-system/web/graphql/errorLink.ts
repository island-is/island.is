import { ApolloError, ServerError } from '@apollo/client'
import { onError, ErrorResponse } from '@apollo/client/link/error'

import {
  api,
  NotificationService,
} from '@island.is/judicial-system-web/src/services'

export default onError(({ graphQLErrors, networkError }: ErrorResponse) => {
  if (networkError) {
    return NotificationService.onNetworkError(networkError as ServerError)
  }

  if (graphQLErrors) {
    graphQLErrors.forEach(async (err) => {
      switch (err.extensions?.code) {
        case 'UNAUTHENTICATED':
          await api.logout()
          window.location.assign(
            `${api.apiUrl}/api/auth/login?redirectRoute=${window.location.pathname}`,
          )
          return
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
