import { onError, ErrorResponse } from '@apollo/client/link/error'
import Router from 'next/router'

import { toast } from '@island.is/island-ui/core'

import { api } from '../services'

export default onError(({ graphQLErrors, networkError }: ErrorResponse) => {
  if (networkError) {
    toast.error(networkError.message)
    return
  }

  if (graphQLErrors) {
    graphQLErrors.forEach((err) => {
      switch (err.extensions?.code) {
        case 'UNAUTHENTICATED':
          return api.logout().then(() => Router.reload())
        case 'FORBIDDEN':
          return
        default:
          return toast.error(graphQLErrors.join('\n'))
      }
    })
  }
})
