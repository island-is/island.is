import {
  ApolloClient,
  ApolloLink,
  defaultDataIdFromObject,
  HttpLink,
  InMemoryCache,
  ServerError,
  ServerParseError,
} from '@apollo/client'
import * as WebBrowser from 'expo-web-browser'
import { setContext } from '@apollo/client/link/context'
import { onError } from '@apollo/client/link/error'
import { RetryLink } from '@apollo/client/link/retry'
import { MMKVStorageWrapper, persistCache } from 'apollo3-cache-persist'
import { config, getConfig } from '../config'
import { environments } from '../constants/environments'
import { setInitializer } from './client-instance'
import { getAuthStoreRef } from '../stores/auth-store-ref'
import { environmentStore } from '../stores/environment-store'
import { createMMKVStorage } from '../stores/mmkv'
import { getCustomUserAgent } from '../utils/user-agent'
import { GenericUserLicense } from './types/schema'
import { createNetworkStatusNotifier } from 'react-apollo-network-status'

export function cognitoAuthUrl() {
  const url = `https://cognito.shared.devland.is/login`
  const params = {
    approval_prompt: 'prompt',
    client_id: config.cognitoClientId,
    redirect_uri: `${config.bundleId}://cognito`,
    response_type: 'token',
    scope: 'openid',
    state: 'state',
  }
  return `${url}?${new URLSearchParams(params)}`
}

const NetworkStatusNotifier = createNetworkStatusNotifier()

export const useApolloNetworkStatus =
  NetworkStatusNotifier.useApolloNetworkStatus

const apolloMMKVStorage = createMMKVStorage({ withEncryption: true })

const httpLink = new HttpLink({
  uri() {
    return `${getConfig().apiUrl.replace(/\/$/, '')}/graphql`
  },
  fetch,
})

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

let cognitoBrowserOpen = false

// Keep in sync with LOCK_SCREEN_SUPPRESS_MAX_MS in stores/auth-store.ts.
// Inlined here because client.ts uses getAuthStoreRef() instead of importing
// auth-store directly to avoid a circular dependency.
const LOCK_SCREEN_SUPPRESS_MAX_MS = 15 * 60 * 1000

const triggerCognitoReauth = ({
  clearStaleToken,
}: {
  clearStaleToken: boolean
}) => {
  if (clearStaleToken) {
    environmentStore.setState({ cognito: null })
  }
  const redirectUrl = cognitoAuthUrl()
  getAuthStoreRef().setState({ cognitoAuthUrl: redirectUrl })
  if (
    config.isTestingApp &&
    getAuthStoreRef().getState().authorizeResult &&
    !cognitoBrowserOpen
  ) {
    cognitoBrowserOpen = true
    // Suppress the app-lock screen while the Cognito browser is open. iOS
    // Keychain autofill in the Microsoft login page briefly backgrounds the
    // app, which would otherwise trigger the AuthLayout AppState listener and
    // push /app-lock, dismissing the FORM_SHEET webview.
    getAuthStoreRef().setState({
      lockScreenSuppressedUntil: Date.now() + LOCK_SCREEN_SUPPRESS_MAX_MS,
    })
    WebBrowser.openBrowserAsync(redirectUrl, {
      presentationStyle: WebBrowser.WebBrowserPresentationStyle.FORM_SHEET,
    })
      .finally(() => {
        cognitoBrowserOpen = false
        getAuthStoreRef().setState({ lockScreenSuppressedUntil: undefined })
      })
      .catch(() => void 0)
  }
}

const errorLink = onError(({ graphQLErrors, networkError, operation }) => {
  if (graphQLErrors) {
    graphQLErrors.map((graphQLError) =>
      console.log(`[GraphQL error]: ${JSON.stringify(graphQLError, null, 2)}`),
    )
  }

  if (networkError) {
    // Cognito proxy served the HTML login page (no token / cookie path)
    if (networkError.name === 'ServerParseError') {
      const parseError = networkError as ServerParseError
      const isCognitoLogin = parseError.bodyText.includes('cognito-login.css')
      const isCognitoRedirect = parseError?.response?.url?.includes('cognito')
      if (isCognitoLogin || isCognitoRedirect) {
        triggerCognitoReauth({ clearStaleToken: false })
        return
      }
    }

    // Cognito proxy rejected an expired Bearer token in X-Cognito-Token: 401
    // (only applies in non-prod environments where the API is fronted by Cognito)
    if (
      networkError.name === 'ServerError' &&
      (networkError as ServerError).statusCode === 401 &&
      environmentStore.getState().environment.idsIssuer !==
        environments.prod.idsIssuer
    ) {
      triggerCognitoReauth({ clearStaleToken: true })
      return
    }

    console.log(`[Network error]: ${networkError}`)
  }
})

const getAndRefreshToken = async () => {
  const { refresh } = getAuthStoreRef().getState()
  let { authorizeResult } = getAuthStoreRef().getState()

  const timeUntilExpiration =
    new Date(authorizeResult?.accessTokenExpirationDate ?? 0).getTime() -
    Date.now()
  const isTokenPerhapsExpired = timeUntilExpiration < 5 * 1000
  const isTokenCloseToExpiring = timeUntilExpiration < 60 * 1000
  if (isTokenPerhapsExpired) {
    // get a new token to be safe
    await refresh()
    authorizeResult = getAuthStoreRef().getState().authorizeResult
  } else if (isTokenCloseToExpiring) {
    // expires in less than 60 seconds, so refresh in the background
    refresh().catch((err: Error) => {
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
      cookie: [getAuthStoreRef().getState().cookies]
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
    // Custom cache key for GenericUserLicense.
    // The backend does not expose a single stable id, so we synthesise one from
    // license.type and payload.metadata.licenseId. This must stay in sync with
    // the fields selected in GenericUserLicenseFragment so list and detail
    // queries for the same license share the same cache entry.
    GenericUserLicense: {
      keyFields: (object) => {
        const licenseType = (object as GenericUserLicense).license?.type
        const licenseId = (object as GenericUserLicense).payload?.metadata
          ?.licenseId

        if (licenseType && licenseId) {
          // Composite key ensures no collisions between different license types
          // that might share the same licenseId.
          return `${licenseType}:${licenseId}`
        }

        if (licenseId) {
          // Fallback when type is missing but licenseId is still unique enough.
          return licenseId
        }

        // Last resort – let Apollo fall back to its default normalisation.
        return defaultDataIdFromObject(object) ?? undefined
      },
    },
  },
})

// Re-export from client-instance for backward compatibility
export { getApolloClientAsync, getApolloClient } from './client-instance'

const initializeApolloClient = async () => {
  await persistCache({
    cache,
    storage: new MMKVStorageWrapper({
      getItem: async (key) => {
        const value = await apolloMMKVStorage.getStringAsync(key)
        return value ?? null
      },
      setItem: async (key, value) => {
        await apolloMMKVStorage.setItem(key, value)
        return true
      },
      removeItem: async (key) => {
        await apolloMMKVStorage.removeItem(key)
        return true
      },
    }),
  })

  return new ApolloClient({
    link: ApolloLink.from([retryLink, errorLink, authLink, httpLink]),
    defaultOptions: {
      watchQuery: {
        fetchPolicy: 'cache-and-network',
      },
    },
    cache,
  })
}

// Register the initializer so client-instance can create the client on demand
setInitializer(initializeApolloClient)
