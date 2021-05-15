import {
  ApolloClient,
  ApolloLink,
  fromPromise,
  HttpLink,
  InMemoryCache,
} from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { onError } from '@apollo/client/link/error'
import { RetryLink } from '@apollo/client/link/retry'
import CookieManager from '@react-native-community/react-native-cookies'
import { Navigation } from 'react-native-navigation'
import { authStore } from '../stores/auth-store'
import { ComponentRegistry } from '../utils/component-registry'
import { config } from '../utils/config'
import { typeDefs } from './type-defs'
import { typePolicies } from './type-policies'

const uri = `${config.apiEndpoint.replace(/\/$/, '')}/graphql`

const httpLink = new HttpLink({
  uri,
  fetch,
  credentials: 'omit',
})

const getNewToken = async () => {
  await authStore.getState().refresh()
  return authStore.getState().authorizeResult?.accessToken
}

const retryLink = new RetryLink()

const errorLink = onError(
  ({ graphQLErrors, networkError, forward, operation }) => {
    if (graphQLErrors) {
      if (graphQLErrors?.[0]?.message === 'Unauthorized') {
        return fromPromise(
          getNewToken().catch((error) => {
            return
          }),
        )
          .filter((value) => Boolean(value))
          .flatMap((accessToken) => {
            const oldHeaders = operation.getContext().headers
            operation.setContext({
              headers: {
                ...oldHeaders,
                authorization: `Bearer ${accessToken}`,
              },
            })
            return forward(operation)
          })
      }

      graphQLErrors.map(({ message, locations, path }) =>
        console.log(
          `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
        ),
      )
    }

    if (networkError) {
      console.log(`[Network error]: ${networkError}`)

      // Detect possible OAuth needed
      if (networkError.name === 'ServerParseError') {
        const redirectUrl = (networkError as any).response?.url
        if (
          redirectUrl &&
          redirectUrl.indexOf('cognito.shared.devland.is') >= 0
        ) {
          if (!authStore.getState().isCogitoAuth) {
            authStore.setState({ isCogitoAuth: true })
            Navigation.showModal({
              component: {
                name: ComponentRegistry.DevtoolsCognitoAuthScreen,
                passProps: { url: redirectUrl },
              },
            })
          }
        }
      }
    }
  },
)

const obj2cookie = (obj: any) =>
  Object.entries(obj)
    .reduce((acc: string[], item) => {
      acc.push(item.join('='))
      return acc
    }, [])
    .join('; ')

const authLink = setContext(async (_, { headers }) => ({
  headers: {
    ...headers,
    authorization: `Bearer ${
      authStore.getState().authorizeResult?.accessToken
    }`,
    cookie: await CookieManager.get(config.apiEndpoint, true).then(obj2cookie),
  },
}))

export const client = new ApolloClient({
  link: ApolloLink.from([retryLink, errorLink, authLink, httpLink]),
  cache: new InMemoryCache({ typePolicies }),
  typeDefs,
})
