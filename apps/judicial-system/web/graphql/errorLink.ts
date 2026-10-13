import type { ErrorResponse } from '@apollo/client/link/error'
import { onError } from '@apollo/client/link/error'

import { userRef } from '@island.is/judicial-system-web/src/components'
import { api } from '@island.is/judicial-system-web/src/services'

export default onError(
  ({ graphQLErrors, networkError, operation }: ErrorResponse) => {
    if (networkError) {
      // Forwarded to Datadog by the browser-logs SDK
      console.error(
        `Network error in operation ${operation.operationName}: ${networkError.message}`,
      )
      return
    }

    if (graphQLErrors) {
      graphQLErrors.forEach(async (err) => {
        switch (err.extensions?.code) {
          case 'UNAUTHENTICATED':
            {
              const userId = userRef.current?.id ? `/${userRef.current.id}` : ''
              const userNationalId =
                userRef.authBypass && userRef.current?.nationalId
                  ? `nationalId=${userRef.current.nationalId}&`
                  : ''
              window.location.assign(
                `${api.apiUrl}/api/auth/login${userId}?${userNationalId}redirectRoute=${window.location.pathname}`,
              )
            }
            return
          default:
            // Forwarded to Datadog by the browser-logs SDK
            console.error(
              `GraphQL error in operation ${operation.operationName}: ${
                err.message
              } (code: ${err.extensions?.code}, path: ${err.path?.join('.')})`,
            )
            return
        }
      })
    }
  },
)
