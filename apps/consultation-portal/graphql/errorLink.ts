import { onError, ErrorResponse } from '@apollo/client/link/error'
import { signIn } from 'next-auth/client'

export default onError(({ graphQLErrors, networkError }: ErrorResponse) => {
  if (networkError) {
    return
  }

  if (graphQLErrors) {
    const errorCodes = graphQLErrors.map((err) => err.extensions?.code)
    const errorMessage = graphQLErrors.map((err) => err.message)
    if (
      errorCodes.includes('UNAUTHENTICATED') ||
      errorMessage.includes('Unauthorized')
    ) {
      if (typeof window !== 'undefined') {
        signIn('identity-server', {
          callbackUrl: window.location.href,
        })
      }
      return
    } else if (errorCodes.includes('FORBIDDEN')) {
      return
    }
  }
})
