import { ApolloError, ServerError } from '@apollo/client'
import { onError, ErrorResponse } from '@apollo/client/link/error'

import { NotificationService } from '@island.is/financial-aid-web/osk/src/services'
import { identityServerId } from '@island.is/financial-aid/shared/lib'
import { signIn } from 'next-auth/client'

export default onError(({ graphQLErrors, networkError }: ErrorResponse) => {
  if (networkError) {
    return NotificationService.onNetworkError(networkError as ServerError)
  }

  if (graphQLErrors) {
    graphQLErrors.forEach((err) => {
      switch (err.extensions?.code) {
        case 'UNAUTHENTICATED':
          return signIn(identityServerId, {
            callbackUrl: `${window.location.href}`,
          })
        default:
          return NotificationService.onGraphQLError({
            graphQLErrors,
          } as ApolloError)
      }
    })
  }
})
