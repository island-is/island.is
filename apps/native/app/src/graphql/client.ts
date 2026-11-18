import {
  ApolloClient,
  ApolloLink,
  defaultDataIdFromObject,
  HttpLink,
  InMemoryCache,
  Operation,
  ServerError,
  ServerParseError,
} from '@apollo/client'
import * as WebBrowser from 'expo-web-browser'
import { setContext } from '@apollo/client/link/context'
import { onError } from '@apollo/client/link/error'
import { RetryLink } from '@apollo/client/link/retry'
import { MMKVStorageWrapper, persistCache } from 'apollo3-cache-persist'
import { config, getConfig } from '../config'
import { LOCK_SCREEN_SUPPRESS_MAX_MS } from '../constants/auth'
import { environments } from '../constants/environments'
import { getIasClient, isNativeLogin } from '../lib/ias'
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

const getGraphqlUrl = () => `${getConfig().apiUrl.replace(/\/$/, '')}/graphql`

const httpLink = new HttpLink({
  uri: getGraphqlUrl,
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
    // Suppress app-lock: iOS Keychain autofill backgrounds the app and would
    // otherwise dismiss the FORM_SHEET webview via the AppState listener.
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

// Tag each GenericUserLicense in the response with the locale used to fetch it.
// Lets the cache key include the locale so entities for different locales don't
// overwrite each other in normalised storage.
const licenseLocaleTagLink = new ApolloLink((operation, forward) => {
  const locale = (operation.variables as { locale?: string } | undefined)
    ?.locale
  return forward(operation).map((response) => {
    const collection = response.data?.genericLicenseCollection
    const licenses = collection?.licenses
    if (!locale || !collection || !Array.isArray(licenses)) {
      return response
    }
    return {
      ...response,
      data: {
        ...response.data,
        genericLicenseCollection: {
          ...collection,
          licenses: licenses.map((license: Record<string, unknown>) => ({
            ...license,
            __locale: locale,
          })),
        },
      },
    }
  })
})

const errorLink = onError(({ graphQLErrors, networkError, operation }) => {
  if (graphQLErrors) {
    graphQLErrors.map((graphQLError) =>
      console.log(`[GraphQL error]: ${JSON.stringify(graphQLError, null, 2)}`),
    )
  }

  if (networkError) {
    // Cognito proxy served the HTML login page
    if (networkError.name === 'ServerParseError') {
      const parseError = networkError as ServerParseError
      const isCognitoLogin = parseError.bodyText.includes('cognito-login.css')
      const isCognitoRedirect = parseError?.response?.url?.includes('cognito')
      if (isCognitoLogin || isCognitoRedirect) {
        triggerCognitoReauth({ clearStaleToken: false })
        return
      }
    }

    // 401 from the Cognito proxy (non-prod only).
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

/**
 * A locked native login has no tokens until the lock screen unlocks it, so
 * requests wait instead of failing. Logging out ends the wait too.
 */
const waitForNativeUnlock = () => {
  const store = getAuthStoreRef()
  const isLocked = (state: {
    authorizeResult?: unknown
    nativeUser?: unknown
  }) => !state.authorizeResult && !!state.nativeUser
  if (!isLocked(store.getState())) {
    return Promise.resolve()
  }
  return new Promise<void>((resolve) => {
    const unsubscribe = store.subscribe((state) => {
      if (!isLocked(state)) {
        unsubscribe()
        resolve()
      }
    })
  })
}

export const getAndRefreshToken = async () => {
  await waitForNativeUnlock()
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

// The latest answer from each server, with the DPoP nonce it carried: proofs
// are fresh by that, not by the phone's clock. Kept in memory only.
const dpopAnswers = new Map<string, { nonce?: string; receivedAt: number }>()
// The GraphQL API's nonces last 5 minutes.
const DPOP_NONCE_LIFETIME_MS = 5 * 60 * 1000
// How long other calls wait for the first one's answer, at most.
const FIRST_CALL_TIMEOUT_MS = 10_000
// The call that goes first while a server's nonce is missing or too old.
const firstCalls = new Map<
  string,
  { answered: Promise<void>; answer(): void }
>()

const originOf = (url: string) => /^[a-z]+:\/\/[^/]+/i.exec(url)?.[0] ?? url

/** Keeps a response's DPoP nonce for the next proofs to that server. */
export const rememberDpopNonce = (url: string, headers?: Headers) => {
  const origin = originOf(url)
  if (headers) {
    const nonce = headers.get('DPoP-Nonce') ?? undefined
    dpopAnswers.set(origin, { nonce, receivedAt: Date.now() })
  }
  firstCalls.get(origin)?.answer()
}

/**
 * The nonce for the next proof to a server. Once it's too old, calls sent
 * together would each be refused and sent again, so the first goes alone and
 * the others wait for the nonce its answer brings. A server that sends no
 * nonces isn't waited for.
 */
const getDpopNonce = async (url: string) => {
  const origin = originOf(url)
  const latest = dpopAnswers.get(origin)
  if (
    latest &&
    (!latest.nonce || Date.now() - latest.receivedAt < DPOP_NONCE_LIFETIME_MS)
  ) {
    return latest.nonce
  }

  const first = firstCalls.get(origin)
  if (first) {
    await first.answered
    return dpopAnswers.get(origin)?.nonce
  }

  let answer!: () => void
  const answered = new Promise<void>((resolve) => {
    answer = resolve
  })
  firstCalls.set(origin, { answered, answer })
  // Also when no answer comes, e.g. the call failed before it was sent.
  setTimeout(answer, FIRST_CALL_TIMEOUT_MS)
  void answered.then(() => {
    if (firstCalls.get(origin)?.answered === answered) {
      firstCalls.delete(origin)
    }
  })
  return latest?.nonce
}

/**
 * The server refused the proof for a missing or expired nonce, e.g. after the
 * app was idle. The request did nothing: send it once more, with a new proof.
 */
export const isDpopNonceError = (headers?: Headers) =>
  /error="use_dpop_nonce"/.test(headers?.get('WWW-Authenticate') ?? '')

/**
 * Authorization for a request: a browser login's token as Bearer, or a native
 * login's token, which is bound to the install key, as DPoP with a proof for
 * this method and URL.
 */
export const getAuthHeaders = async (
  method: string,
  url: string,
): Promise<Record<string, string>> => {
  const token = await getAndRefreshToken()
  if (token && isNativeLogin(getAuthStoreRef().getState().authorizeResult)) {
    return {
      authorization: `DPoP ${token}`,
      dpop: await getIasClient().createDpopProof(
        method,
        url,
        token,
        await getDpopNonce(url),
      ),
    }
  }
  return { authorization: `Bearer ${token}` }
}

const responseHeaders = (operation: Operation) =>
  (operation.getContext().response as Response | undefined)?.headers

// Before authLink, so a retry is signed again.
const dpopNonceLink = ApolloLink.from([
  onError(({ operation, forward }) => {
    const headers = responseHeaders(operation)
    rememberDpopNonce(getGraphqlUrl(), headers)
    if (isDpopNonceError(headers) && !operation.getContext().dpopNonceRetried) {
      operation.setContext({ dpopNonceRetried: true })
      return forward(operation)
    }
  }),
  new ApolloLink((operation, forward) =>
    forward(operation).map((result) => {
      rememberDpopNonce(getGraphqlUrl(), responseHeaders(operation))
      return result
    }),
  ),
])

const authLink = setContext(async (_, { headers }) => {
  return {
    headers: {
      ...headers,
      ...(await getAuthHeaders('POST', getGraphqlUrl())),
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
  // Union/interface types need possibleTypes so the cache can match inline
  // fragments when reading; without it a union member's fields (e.g. the
  // health message content segments) come back undefined.
  possibleTypes: {
    HealthDirectorateHealthConversationMessageContent: [
      'HealthDirectorateHealthConversationTextContent',
      'HealthDirectorateHealthConversationSegmentedContent',
      'HealthDirectorateHealthConversationVideoContent',
    ],
  },
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
        // The paginated wrapper has no id, so Apollo needs an explicit merge.
        healthDirectoratePaginatedHealthConversations: {
          merge: true,
        },
        getUserProfile: {
          merge: true,
        },
        nationalRegistryPerson: {
          merge: false,
        },
        // Client-only, written by the health overview. Defaults to null so a
        // cache-only read before the first write does not warn.
        healthBasicInfoFetchedAt: {
          read: (value: string | null = null) => value,
        },
        // The as-of date is always "now", so keying by it would leave a dead
        // ROOT_QUERY entry behind on every fetch. One consumer, one entry.
        rightsPortalUserDentistRegistration: {
          keyArgs: false,
        },
        rightsPortalPaymentOverview: {
          keyArgs: false,
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
    // license.type and payload.metadata.licenseId. We also append the locale
    // (injected by licenseLocaleTagLink) so entities fetched in different
    // locales don't overwrite each other.
    GenericUserLicense: {
      keyFields: (object) => {
        const licenseType = (object as GenericUserLicense).license?.type
        const licenseId = (object as GenericUserLicense).payload?.metadata
          ?.licenseId
        const locale = (object as { __locale?: string }).__locale

        const baseKey =
          licenseType && licenseId
            ? // Composite key ensures no collisions between different license types
              // that might share the same licenseId.
              `${licenseType}:${licenseId}`
            : // Fallback when type is missing but licenseId is still unique enough.
              licenseId ??
              // Last resort – let Apollo fall back to its default normalisation.
              defaultDataIdFromObject(object) ??
              undefined

        if (!baseKey) {
          return undefined
        }
        return locale ? `${baseKey}:${locale}` : baseKey
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
    link: ApolloLink.from([
      retryLink,
      errorLink,
      dpopNonceLink,
      authLink,
      licenseLocaleTagLink,
      httpLink,
    ]),
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
