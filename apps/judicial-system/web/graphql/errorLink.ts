import { ErrorResponse, onError } from '@apollo/client/link/error'

import { api } from '@island.is/judicial-system-web/src/services'

export default onError(({ graphQLErrors, networkError }: ErrorResponse) => {
  if (networkError) {
    return
  }

  if (graphQLErrors) {
    graphQLErrors.forEach(async (err) => {
      switch (err.extensions?.code) {
        case 'UNAUTHENTICATED':
          window.location.assign(
            `${api.apiUrl}/api/auth/login?redirectRoute=${window.location.pathname}`,
          )
          return
        case 'FORBIDDEN':
          return
        default:
          return
      }
    })
  }
})
