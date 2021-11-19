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
    graphQLErrors.forEach((err) => {
      switch (err.extensions?.code) {
        case 'UNAUTHENTICATED':
          api.logOut()
          window.location.assign('/?villa=innskraning-utrunnin')
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
