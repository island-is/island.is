import { ErrorResponse, onError } from '@apollo/client/link/error'

import { userRef } from '@island.is/judicial-system-web/src/components'
import { api } from '@island.is/judicial-system-web/src/services'

export default onError(({ graphQLErrors, networkError }: ErrorResponse) => {
  if (networkError) {
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
        case 'FORBIDDEN':
          return
        default:
          return
      }
    })
  }
})
