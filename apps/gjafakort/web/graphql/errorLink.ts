import { ApolloError } from 'apollo-client'
import { onError, ErrorResponse } from 'apollo-link-error'
import { ServerError } from 'apollo-link-http-common'

import { NotificationService } from '../services'

export default onError(
  ({
    graphQLErrors,
    networkError,
    operation,
    forward,
    response,
  }: ErrorResponse) => {
    if (response) {
      response.errors = undefined
    }

    if (networkError) {
      if ((networkError as ServerError).statusCode === 401) {
        // return refreshRequest(operation, forward)
        // TODO: logout
        console.error(networkError)
      } else {
        return NotificationService.onNetworkError(networkError as ServerError)
      }
    }

    if (graphQLErrors) {
      return NotificationService.onGraphQLError({
        graphQLErrors,
      } as ApolloError)
    }
  },
)
