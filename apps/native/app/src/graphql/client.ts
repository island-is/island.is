import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  ApolloLink,
} from '@apollo/client'
import { onError } from '@apollo/client/link/error'
import { RetryLink } from '@apollo/client/link/retry'
import { setContext } from '@apollo/client/link/context'
import { config } from '../utils/config'
import { authStore } from '../auth/auth'

const uri = `${config.apiEndpoint.replace(/\/$/, '')}/graphql`;

const httpLink = new HttpLink({
  uri,
  fetch,
  credentials: 'omit'
})

const retryLink = new RetryLink()

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.map(({ message, locations, path }) =>
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
      ),
    )

  if (networkError) console.log(`[Network error]: ${networkError}`)
})

const authLink = setContext((_, { headers }) => ({
  headers: {
    ...headers,
    authorization: `Bearer ${authStore.getState().authorizeResult?.accessToken}`,
    cookie: '_oauth2_proxy=q5rrP9o9bU5Euef6G353QApRlcKL_9nS_0TCFsNzJOugfvD5ttKn3ScEre2B7tIxksueChnbM69HqXetxFruePx1d0eNnsMRBwfX-VAdhrnCIucK99voI7L-iGxqbHcYKxr_8eESmCiLePQ9n-oa9qRDp0c6hByCYy9GL-wOIcxEyN3c1uLv1jTS-UfMla3LNUruxQ4lUllIBsFs9MJONxEkRVgPX5hpifCPOw==|1616159291|VTf3uTCRXLdgSEEI19f2rHagDvColRIvwDD00rB4yFQ=; amplitude_id_fef1e872c952688acd962d30aa545b9edevland.is=eyJkZXZpY2VJZCI6ImU5YWE1NTAxLTVmNDItNDllYy1hNGM0LWM2ZWUyYjIwMjVlZFIiLCJ1c2VySWQiOm51bGwsIm9wdE91dCI6ZmFsc2UsInNlc3Npb25JZCI6MTYxNjQwOTk4NzA0NSwibGFzdEV2ZW50VGltZSI6MTYxNjQwOTk5NTc0OCwiZXZlbnRJZCI6NSwiaWRlbnRpZnlJZCI6MCwic2VxdWVuY2VOdW1iZXIiOjV9',
  },
}))

export const client = new ApolloClient({
  link: ApolloLink.from([retryLink, errorLink, authLink, httpLink]),
  cache: new InMemoryCache(),
})
