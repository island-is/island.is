import { ApolloError, ServerError } from '@apollo/client'
import { onError, ErrorResponse } from '@apollo/client/link/error'
import { signIn } from 'next-auth/client'
import Router from 'next/router'
import { identityServerId } from '../pages/api/auth/idsConfig'

import { NotificationService, api } from '../services'

export default onError(({ graphQLErrors, networkError }: ErrorResponse) => {
  if (networkError) {
    return NotificationService.onNetworkError(networkError as ServerError)
  }

  if (graphQLErrors) {
    graphQLErrors.forEach((err) => {
      if (err.message === 'Unauthorized') {
        return signIn(process.env.IDENTITY_SERVER_ISSUER_URL, {
          callbackUrl: `${window.location.href}`,
        })
      }
      switch (err.extensions?.code) {
        case 'UNAUTHENTICATED':
          return api.logout().then(() => Router.reload())
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
