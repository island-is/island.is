import { onError, ErrorResponse } from '@apollo/client/link/error'

import { toast } from '@island.is/island-ui/core'

import { api } from '../services'

export default onError(({ graphQLErrors, networkError }: ErrorResponse) => {
  if (networkError) {
    toast.error(networkError.message)
    return
  }

  if (graphQLErrors) {
    const errorCodes = graphQLErrors.map((err) => err.extensions?.code)
    if (errorCodes.includes('UNAUTHENTICATED')) {
      api.logout().then(() => window?.location.reload())
      return
    } else if (errorCodes.includes('FORBIDDEN')) {
      return
    }

    toast.error(graphQLErrors.join('\n'))
  }
})
