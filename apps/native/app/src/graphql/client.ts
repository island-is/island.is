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
import { openNativeBrowser } from '../lib/rn-island'
import { cognitoAuthUrl } from '../screens/cognito-auth/config-switcher'
import { authStore } from '../stores/auth-store'
import { environmentStore } from '../stores/environment-store'
import { createMMKVStorage } from '../stores/mmkv'
import { offlineStore } from '../stores/offline-store'
import { MainBottomTabs } from '../utils/component-registry'
import { getCustomUserAgent } from '../utils/user-agent'

const apolloMMKVStorage = createMMKVStorage({ withEncryption: true })

const connectivityLink = new ApolloLink((operation, forward) => {
  return forward(operation).map((response) => {
    // Check if the network response was successful
    const success =
      response.errors === undefined || response.errors.length === 0

    // This is a fallback check if the @react-native-community/netinfo will fail to detect if the network status is available again.
    if (success && !offlineStore.getState().isConnected) {
      offlineStore.setState({ isConnected: true })
    }

    return response
  })
})

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
            openNativeBrowser(cognitoAuthUrl(), MainBottomTabs)
          }
        }
      }
    }
  },
)

const getAndRefreshToken = async () => {
  const { refresh } = authStore.getState()
  let { authorizeResult } = authStore.getState()

  const timeUntilExpiration =
    new Date(authorizeResult?.accessTokenExpirationDate ?? 0).getTime() -
    Date.now()
  const isTokenPerhapsExpired = timeUntilExpiration < 5 * 1000
  const isTokenCloseToExpiring = timeUntilExpiration < 60 * 1000
  if (isTokenPerhapsExpired) {
    // get a new token to be safe
    await refresh()
    authorizeResult = authStore.getState().authorizeResult
  } else if (isTokenCloseToExpiring) {
    // expires in less than 60 seconds, so refresh in the background
    refresh().catch((err) => {
      console.error('Failed to refresh token in the background', err)
    })
  }

  return authorizeResult?.accessToken
}

const authLink = setContext(async (_, { headers }) => {
  const token = await getAndRefreshToken()

  return {
    headers: {
      ...headers,
      authorization: `Bearer ${token}`,
      'X-Cognito-Token': `Bearer ${
        environmentStore.getState().cognito?.accessToken
      }`,
      'User-Agent': getCustomUserAgent(),
      cookie: [authStore.getState().cookies]
        .filter((x) => String(x) !== '')
        .join('; '),
    },
  }
})

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
    Query: {
      fields: {
        userNotifications: {
          merge: true,
        },
        getUserProfile: {
          merge: true,
        },
        nationalRegistryPerson: {
          merge: false,
        },
      },
    },
    DocumentV2: {
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
    storage: new MMKVStorageWrapper(apolloMMKVStorage),
  })

  apolloClient = new ApolloClient({
    link: ApolloLink.from([
      connectivityLink,
      retryLink,
      errorLink,
      authLink,
      httpLink,
    ]),
    defaultOptions: {
      watchQuery: {
        fetchPolicy: 'cache-and-network',
      },
    },
    cache,
  })

  return apolloClient
}
