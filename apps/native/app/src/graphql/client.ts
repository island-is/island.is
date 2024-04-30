import {
  ApolloClient,
  ApolloLink,
  defaultDataIdFromObject,
  fromPromise,
  HttpLink,
  InMemoryCache,
  NormalizedCacheObject,
} from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { onError } from '@apollo/client/link/error'
import { RetryLink } from '@apollo/client/link/retry'
import { MMKVStorageWrapper, persistCache } from 'apollo3-cache-persist'
import { config, getConfig } from '../config'
import { openBrowser } from '../lib/rn-island'
import { cognitoAuthUrl } from '../screens/cognito-auth/config-switcher'
import { authStore } from '../stores/auth-store'
import { environmentStore } from '../stores/environment-store'
import { apolloMKKVStorage } from '../stores/mkkv'
import { offlineStore } from '../stores/offline-store'
import { MainBottomTabs } from '../utils/component-registry'

const httpLink = new HttpLink({
  uri() {
    return `${getConfig().apiUrl.replace(/\/$/, '')}/graphql`
  },
  fetch,
})

const getNewToken = async () => {
  await authStore.getState().refresh()
  return authStore.getState().authorizeResult?.accessToken
}

const retryLink = new RetryLink({
  attempts: {
    max: 3,
    retryIf(err, _operation) {
      if (err?.length === 0 || !err) {
        return true
      }
      return false
    },
  },
})

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
          .flatMap((accessToken: any) => {
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
          `[GraphQL error]: Message: ${message}, Location: ${JSON.stringify(
            locations,
          )}, Path: ${JSON.stringify(path)}`,
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
          authStore.setState({ cognitoAuthUrl: redirectUrl })
          if (config.isTestingApp && authStore.getState().authorizeResult) {
            openBrowser(cognitoAuthUrl(), MainBottomTabs)
          }
        }
      } else {
        // This might be an SSL error, a socket error because your app is offline, or a 500 or any other HTTP error.
        // We determine that we are offline if we receive a network error
        offlineStore.getState().actions.setIsConnected(false)
      }
    }
  },
)

const getAndRefreshToken = () => {
  const { authorizeResult, refresh } = authStore.getState()

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const isTokenAboutToExpire =
    new Date(authorizeResult?.accessTokenExpirationDate ?? 0).getTime() <
    Date.now() - 60 * 5 * 1000
  if (isTokenAboutToExpire) {
    // expires in less than 5 minutes, so refresh
    refresh()
  }
  return authorizeResult?.accessToken
}

const authLink = setContext(async (_, { headers }) => ({
  headers: {
    ...headers,
    authorization: `Bearer ${getAndRefreshToken()}`,
    'X-Cognito-Token': `Bearer ${
      environmentStore.getState().cognito?.accessToken
    }`,
    cookie: [
      // ...(await CookieManager.get(config.apiEndpoint, true).then(obj2cookie)),
      authStore.getState().cookies,
    ]
      .filter((x) => String(x) !== '')
      .join('; '),
  },
}))

export const archivedCache = new Map()

const cache = new InMemoryCache({
  dataIdFromObject: (object) => {
    switch (object.__typename) {
      case 'VehiclesVehicle':
        return `VehiclesVehicle:${object.permno}`
      case 'VehicleMileageDetail':
        return `VehicleMileageDetail:${object.internalId}`
      default:
        return defaultDataIdFromObject(object)
    }
  },
  typePolicies: {
    Document: {
      fields: {
        archived: {
          read(_value, { readField, variables }) {
            const defaultState = !!variables?.input?.archived
            const id = readField('id')

            if (!archivedCache.has(id)) {
              archivedCache.set(id, defaultState)
            }

            return archivedCache.get(id)
          },
        },
      },
    },
  },
})

let apolloClientPromise: Promise<ApolloClient<NormalizedCacheObject>> | null =
  null
let apolloClient: ApolloClient<NormalizedCacheObject> | null = null

export const getApolloClientAsync = () => {
  if (!apolloClientPromise) {
    apolloClientPromise = initializeApolloClient()
  }

  return apolloClientPromise
}

export const getApolloClient = () => {
  if (!apolloClient) {
    throw new Error('Apollo client not initialized')
  }

  return apolloClient
}

export const initializeApolloClient = async () => {
  await persistCache({
    cache,
    storage: new MMKVStorageWrapper(apolloMKKVStorage),
  })

  apolloClient = new ApolloClient({
    link: ApolloLink.from([retryLink, errorLink, authLink, httpLink]),
    defaultOptions: {
      watchQuery: {
        fetchPolicy: 'network-only',
        nextFetchPolicy(currentFetchPolicy, { reason, initialFetchPolicy }) {
          if (reason === 'variables-changed') {
            return initialFetchPolicy
          }

          if (
            currentFetchPolicy === 'network-only' ||
            currentFetchPolicy === 'cache-and-network'
          ) {
            // Demote the network policies (except "no-cache") to "cache-and-network"
            // after the first request.
            return 'cache-and-network'
          }

          // Leave all other fetch policies unchanged.
          return currentFetchPolicy
        },
      },
    },
    cache,
  })

  return apolloClient
}
