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
import { authStore } from '../stores/auth-store'
import { typeDefs } from './type-defs';
import { typePolicies } from './type-policies';
import { Alert } from 'react-native'
import { Navigation } from 'react-native-navigation'
import { ComponentRegistry } from '../utils/navigation-registry'
import CookieManager from '@react-native-community/react-native-cookies'

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

  if (networkError) {
    console.log(`[Network error]: ${networkError}`)

    // Detect possible OAuth needed
    if (networkError.name === 'ServerParseError') {
      const redirectUrl = (networkError as any).response?.url;
      if (redirectUrl && redirectUrl.indexOf('cognito.shared.devland.is') >= 0) {
        if (!authStore.getState().isCogitoAuth) {
          authStore.setState({ isCogitoAuth: true });
          Navigation.showModal({
            component: {
              name: ComponentRegistry.DevtoolsCognitoAuthScreen,
              passProps: { url: redirectUrl },
            },
          });
        }
      }
    }

  }
})

const obj2cookie = (obj: any) => Object.entries(obj).reduce((acc: string[], item) => {
  acc.push(item.join('='));
  return acc;
}, []).join('; ');

const authLink = setContext(async (_, { headers }) => ({
  headers: {
    ...headers,
    authorization: `Bearer ${authStore.getState().authorizeResult?.accessToken}`,
    cookie: await CookieManager.get(config.apiEndpoint, true).then(obj2cookie),
  },
}))

export const client = new ApolloClient({
  link: ApolloLink.from([retryLink, errorLink, authLink, httpLink]),
  cache: new InMemoryCache({ typePolicies }),
  typeDefs,
})
