import { ApolloError, ServerError } from '@apollo/client'
import { ErrorResponse, onError } from '@apollo/client/link/error'
import { identityServerId } from '@island.is/air-discount-scheme-web/lib'
import { signIn } from 'next-auth/react'

import { NotificationService } from '../services'

export default onError(({ graphQLErrors, networkError }: ErrorResponse) => {
  if (networkError) {
    return NotificationService.onNetworkError(networkError as ServerError)
  }

  if (graphQLErrors) {
    graphQLErrors.forEach((err) => {
      if (typeof window !== 'undefined' && err.message === 'Unauthorized') {
        return signIn(identityServerId, {
          callbackUrl: `${window.location.href}`,
        })
      }
      switch (err.extensions?.code) {
        case 'UNAUTHENTICATED':
          if (typeof window !== 'undefined') {
            signIn('identity-server', {
              callbackUrl: `${window.location.href}`,
            })
          }
          break
        default:
          return NotificationService.onGraphQLError({
            graphQLErrors,
          } as ApolloError)
      }
    })
  }
})
