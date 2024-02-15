import { onError, ErrorResponse } from '@apollo/client/link/error'

export default onError(({ graphQLErrors, networkError }: ErrorResponse) => {
  if (networkError) {
    return
  }

  if (graphQLErrors) {
    const errorCodes = graphQLErrors.map((err) => err.extensions?.['code'])
    const errorMessage = graphQLErrors.map((err) => err.message)
    if (
      errorCodes.includes('UNAUTHENTICATED') ||
      errorMessage.includes('Unauthorized')
    ) {
      return
    } else if (errorCodes.includes('FORBIDDEN')) {
      return
    }
  }
})
