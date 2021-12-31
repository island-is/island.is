import { ApolloError, ServerError } from '@apollo/client'
import { onError, ErrorResponse } from '@apollo/client/link/error'
import { signIn } from 'next-auth/client'
import { identityServerId } from '@island.is/air-discount-scheme-web/lib'

import { NotificationService, api } from '../services'

export default onError(({ graphQLErrors, networkError }: ErrorResponse) => {
  if (networkError) {
    return NotificationService.onNetworkError(networkError as ServerError)
  }

  if (graphQLErrors) {
    console.log(JSON.stringify(graphQLErrors))
    graphQLErrors.forEach((err) => {
      if (err.message === 'Unauthorized') {
        return signIn(identityServerId, {
          callbackUrl: `${window.location.href}`,
        })
      }
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
