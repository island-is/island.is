import { onError, ErrorResponse } from '@apollo/client/link/error'

export default onError(({ graphQLErrors, networkError }: ErrorResponse) => {
  if (graphQLErrors)
    graphQLErrors.map(({ message, locations, path }) =>
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
      ),
    )

  if (networkError) console.log(`[Network error]: ${networkError}`)
})
