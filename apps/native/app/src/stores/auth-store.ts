import { Alert, Platform } from 'react-native'
import {
  authorize,
  AuthorizeResult,
  prefetchConfiguration,
  refresh as authRefresh,
  RefreshResult,
  revoke,
} from 'react-native-app-auth'
import Keychain from 'react-native-keychain'
import { deleteToken } from '@react-native-firebase/messaging'

import { bundleId, config, getClientId, getConfig } from '../config'
import { LOCK_SCREEN_SUPPRESS_MAX_MS } from '../constants/auth'
import { getIntl } from '../components/providers/locale-provider'
import { getApolloClientAsync } from '../graphql/client-instance'
import { isAndroid } from '../utils/devices'
import { offlineStore } from './offline-store'
import { preferencesStore } from './preferences-store'
import { notificationsStore } from './notifications-store'
import { getFeatureFlagValue } from '../lib/feature-flag-client'
import { getIasClient, getIasIssuer, isNativeLogin } from '../lib/ias'
import type { IasTokens } from '../lib/ias'
import {
  DeletePasskeyDocument,
  DeletePasskeyMutation,
  DeletePasskeyMutationVariables,
} from '../graphql/types/schema'
import { deduplicatePromise } from '../utils/deduplicatePromise'
import { isOnboarded } from '../utils/onboarding'
import { clearWidgetData } from '../lib/widget-sync'
import { app } from '../lib/firebase'
import { setAuthStoreRef } from './auth-store-ref'
import { create, useStore } from 'zustand'
import { clearAllStorages } from './mmkv'
import { router } from 'expo-router'

const KEYCHAIN_AUTH_KEY = `@islandis_${bundleId}`
const KEYCHAIN_NATIVE_USER_KEY = `@islandis_${bundleId}_native`
const INVALID_REFRESH_TOKEN_ERROR = 'invalid_grant'
const UNAUTHORIZED_USER_INFO = 'Got 401 when fetching user info'

// Optional scopes (not required for all users so we do not want to force a logout)
const OPTIONAL_SCOPES: string[] = []

interface UserInfo {
  sub: string
  nationalId: string
  name: string
}

type KeychainAuthorizeCredentials = Awaited<
  ReturnType<typeof Keychain.getGenericPassword>
>

interface AuthStore {
  authorizeResult: AuthorizeResult | RefreshResult | undefined
  userInfo: UserInfo | undefined
  /**
   * Who is signed in with native login. Its tokens are only kept in memory,
   * so after a lock or a restart it's signed in but locked: no
   * authorizeResult until unlockNative().
   */
  nativeUser: UserInfo | undefined
  lockScreenActivatedAt?: number
  lockScreenComponentId: string | undefined
  // Synchronously set when a push is dispatched, cleared when the lock route
  // mounts (or times out). Prevents two pushers from racing before componentId
  // can dedupe them.
  lockScreenPushPending: boolean
  lockScreenSuppressedUntil: number | undefined
  // Auto-prompt biometrics at most once per lock session (loop guard).
  biometricAutoPromptedForCurrentLock: boolean
  isCogitoAuth: boolean
  cognitoDismissCount: number
  cognitoAuthUrl?: string
  cookies: string
  fetchUserInfo(
    skipRefresh?: boolean,
    skipLogoutIfRefreshFailed?: boolean,
  ): Promise<UserInfo>
  refresh(skipLogout?: boolean): Promise<void | null>
  login(): Promise<boolean>
  /** Signs in with a native login's tokens, as login() does the browser's. */
  loginNative(tokens: IasTokens): Promise<UserInfo>
  /** Revokes and forgets a native login's tokens; stays signed in. */
  lockNative(): Promise<void>
  /** Tokens from a biometric or electronic ID unlock. */
  unlockNative(tokens: IasTokens): void
  logout(skipPasskeyDeletion?: boolean): Promise<boolean>
}

const getAppAuthConfig = () => {
  const config = getConfig()
  const android = isAndroid ? '.auth' : ''

  return {
    issuer: config.idsIssuer,
    clientId: getClientId(),
    redirectUrl: `${config.bundleId}${android}://oauth`,
    scopes: config.idsScopes,
  }
}

export async function prefetchAuthConfig() {
  if (!isAndroid) {
    return
  }

  try {
    const appAuthConfig = getAppAuthConfig()
    await prefetchConfiguration({
      ...appAuthConfig,
      warmAndPrefetchChrome: true,
    })
  } catch (error) {
    // Prefetch is optional, don't block app startup
    console.log('Auth prefetch failed:', error)
  }
}

const clearPasskey = async (userNationalId?: string) => {
  // Clear passkey if exists
  const isPasskeyEnabled = getFeatureFlagValue('isPasskeyEnabled', false)

  if (isPasskeyEnabled) {
    preferencesStore.setState({
      hasCreatedPasskey: false,
      hasOnboardedPasskeys: false,
      lastUsedPasskey: 0,
    })

    const client = await getApolloClientAsync()
    try {
      await client.mutate<
        DeletePasskeyMutation,
        DeletePasskeyMutationVariables
      >({
        mutation: DeletePasskeyDocument,
      })
    } catch (e) {
      console.error('Failed to delete passkey', e)
    }
  }
}

const storeAuthorizeResult = (
  authorizeResult: AuthorizeResult | RefreshResult,
) =>
  Keychain.setGenericPassword(
    KEYCHAIN_AUTH_KEY,
    JSON.stringify(authorizeResult),
    {
      service: KEYCHAIN_AUTH_KEY,
      accessible: Keychain.ACCESSIBLE.AFTER_FIRST_UNLOCK_THIS_DEVICE_ONLY,
    },
  )

// IasError's code is invalid_grant too when IAS refuses a native login's
// refresh token or no longer has its app login.
const isLogoutError = (e: Error & { code?: string }) => {
  return (
    e.code === INVALID_REFRESH_TOKEN_ERROR ||
    e.message === INVALID_REFRESH_TOKEN_ERROR ||
    e.message === UNAUTHORIZED_USER_INFO
  )
}

export const authStore = create<AuthStore>((set, get) => ({
  authorizeResult: undefined,
  userInfo: undefined,
  nativeUser: undefined,
  lockScreenActivatedAt: undefined,
  lockScreenComponentId: undefined,
  lockScreenPushPending: false,
  lockScreenSuppressedUntil: undefined,
  biometricAutoPromptedForCurrentLock: false,
  isCogitoAuth: false,
  cognitoDismissCount: 0,
  cognitoAuthUrl: undefined,
  cookies: '',
  async fetchUserInfo(skipRefresh = false, skipLogoutIfRefreshFailed = false) {
    // A native login's tokens come from IAS, which testing builds can point
    // elsewhere. Its userinfo still only reads Bearer, even for DPoP tokens.
    const issuer = isNativeLogin(get().authorizeResult)
      ? getIasIssuer()
      : getAppAuthConfig().issuer
    // Detect expired token
    const expiresAt = get().authorizeResult?.accessTokenExpirationDate ?? 0

    if (!skipRefresh && new Date(expiresAt) < new Date()) {
      await get().refresh(skipLogoutIfRefreshFailed)
    }

    const res = await fetch(`${issuer.replace(/\/$/, '')}/connect/userinfo`, {
      headers: {
        Authorization: `Bearer ${get().authorizeResult?.accessToken}`,
      },
    })

    if (res.status === 401) {
      // Attempt to refresh the access token
      if (!skipRefresh) {
        await get().refresh(skipLogoutIfRefreshFailed)
        // Retry the userInfo call
        return get().fetchUserInfo(true)
      }
      throw new Error(UNAUTHORIZED_USER_INFO)
    } else if (res.status === 200) {
      const userInfo = await res.json()
      set({ userInfo })

      return userInfo
    }
  },
  refresh: deduplicatePromise(async (skipLogout = false) => {
    const intl = getIntl()
    const appAuthConfig = getAppAuthConfig()
    const refreshToken = get().authorizeResult?.refreshToken

    if (!refreshToken) {
      return
    }

    let newAuthorizeResult
    try {
      newAuthorizeResult = isNativeLogin(get().authorizeResult)
        ? await getIasClient().refresh(refreshToken)
        : await authRefresh(appAuthConfig, { refreshToken })
    } catch (e) {
      if (!skipLogout && isLogoutError(e as Error & { code?: string })) {
        Alert.alert(
          intl.formatMessage({ id: 'login.expiredTitle' }),
          intl.formatMessage({ id: 'login.expiredMessage' }),
        )

        await get().logout(true)
        // await Navigation.setRoot({ root: await getAppRoot() })
        router.replace('/login')
      }
      throw e
    }

    const authorizeResult = {
      ...get().authorizeResult,
      ...newAuthorizeResult,
    }

    // A native login's tokens stay in memory: a restart needs an unlock.
    if (!isNativeLogin(authorizeResult)) {
      await storeAuthorizeResult(authorizeResult)
    }
    set({ authorizeResult })
  }),
  async login() {
    const appAuthConfig = getAppAuthConfig()
    const authorizeResult = await authorize({
      ...appAuthConfig,
      additionalParameters: {
        prompt: 'login',
        prompt_delegations: 'true',
        ui_locales: preferencesStore.getState().locale,
        externalUserAgent: 'yes',
        // login_prompt: 'select_account',
      },
    })

    if (authorizeResult) {
      await storeAuthorizeResult(authorizeResult)
      set({ authorizeResult })
      return true
    }
    return false
  },
  async loginNative(tokens) {
    set({ authorizeResult: tokens })
    const userInfo = await get().fetchUserInfo(true)
    if (!userInfo) {
      throw new Error('No user info for the native login')
    }
    await Keychain.setGenericPassword(
      KEYCHAIN_NATIVE_USER_KEY,
      JSON.stringify(userInfo),
      {
        service: KEYCHAIN_NATIVE_USER_KEY,
        accessible: Keychain.ACCESSIBLE.AFTER_FIRST_UNLOCK_THIS_DEVICE_ONLY,
      },
    )
    // There's no PIN with native login. The flag still tells a fresh install
    // apart from one that was logged in (see readAuthorizeResult).
    preferencesStore.setState({ hasOnboardedPinCode: true })
    set({ nativeUser: userInfo })
    return userInfo
  },
  async lockNative() {
    const { authorizeResult } = get()
    if (!isNativeLogin(authorizeResult)) {
      return
    }
    set({ authorizeResult: undefined })
    if (authorizeResult?.refreshToken) {
      await getIasClient()
        .revoke(authorizeResult.refreshToken)
        .catch((error) => console.log('Failed to revoke on lock', error))
    }
  },
  unlockNative(tokens) {
    set({ authorizeResult: tokens })
  },
  async logout(skipPasskeyDeletion = false) {
    // Clear all MMKV storages
    clearAllStorages()

    // Clear widgets
    clearWidgetData()

    // Clear push token if exists. Logging out from the lock there are no
    // tokens to tell the server with, so the token is also invalidated on the
    // device: the server's copy stops working, and the next login gets a new
    // one.
    const pushToken = notificationsStore.getState().pushToken
    if (pushToken && get().authorizeResult) {
      void notificationsStore.getState().deletePushToken(pushToken)
    }
    deleteToken(app.messaging()).catch((error) =>
      console.log('Failed to delete the push token', error),
    )
    notificationsStore.getState().reset()

    // Clear passkey if exists, can't delete passkeys if no auth token. A
    // locked native login has none: its request would wait for an unlock.
    if (!skipPasskeyDeletion && get().authorizeResult) {
      const userNationalId = get().userInfo?.nationalId
      await clearPasskey(userNationalId)
    }

    const appAuthConfig = getAppAuthConfig()
    const { authorizeResult, nativeUser } = get()
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const tokenToRevoke = authorizeResult?.accessToken
    try {
      if (nativeUser || isNativeLogin(authorizeResult)) {
        // Ends the app login on IAS, not just this session. Works locked too.
        await getIasClient().logout(authorizeResult?.refreshToken ?? undefined)
      } else if (tokenToRevoke) {
        await revoke(appAuthConfig, {
          tokenToRevoke,
          includeBasicAuth: true,
          sendClientId: true,
        })
      } else {
        throw new Error('No token to revoke')
      }
    } catch (e) {
      console.log('Failed to revoke token', e)
      // NOOP
    }

    const client = await getApolloClientAsync()
    await client.clearStore()
    await Keychain.resetGenericPassword({ service: KEYCHAIN_AUTH_KEY })
    await Keychain.resetGenericPassword({ service: KEYCHAIN_NATIVE_USER_KEY })
    set(
      (state) => ({
        ...state,
        authorizeResult: undefined,
        userInfo: undefined,
        nativeUser: undefined,
        lockScreenActivatedAt: undefined,
      }),
      true,
    )
    // Reset all preferences
    preferencesStore.getState().reset()

    return true
  },
}))

// Register ref so graphql/client.ts can access authStore without a circular import
setAuthStoreRef(authStore)

export const useAuthStore = <U = AuthStore>(
  selector?: (state: AuthStore) => U,
) => useStore(authStore, selector!)

/**
 * Suppress the app lock screen until explicitly cleared or the safety cap expires.
 * Call `clearLockScreenSuppression()` when the flow ends.
 */
export function suppressLockScreen() {
  authStore.setState({
    lockScreenSuppressedUntil: Date.now() + LOCK_SCREEN_SUPPRESS_MAX_MS,
  })
}

export function isLockScreenSuppressed() {
  const until = authStore.getState().lockScreenSuppressedUntil
  return until != null && Date.now() < until
}

export function clearLockScreenSuppression() {
  authStore.setState({ lockScreenSuppressedUntil: undefined })
}

// True if the lock screen is in an auth-required state (not just a mask).
export function isLockScreenActive() {
  return authStore.getState().lockScreenActivatedAt !== undefined
}

/**
 * Whether the app locks. A native login always does, even mid-onboarding:
 * only an unlock gets its tokens back. A browser login once onboarded,
 * except in the testing app.
 */
export function isAppLockEnabled() {
  if (authStore.getState().nativeUser) {
    return true
  }
  return isOnboarded() && !config.isTestingApp
}

export async function readAuthorizeResult(): Promise<void> {
  const { authorizeResult } = authStore.getState()

  // We already have an authorization result in memory, nothing else to do.
  if (authorizeResult) {
    return
  }

  // Attempt to restore the last known authorization data from the secure keychain.
  const keychainResult = await readStoredAuthorizeCredentials()
  if (!keychainResult) {
    if (await restoreNativeUser()) {
      return
    }

    // Prefetch auth configuration on Android (non-blocking optimization) once we know we don't have an authorize result
    void prefetchAuthConfig()

    return
  }

  const restoredAuthorizeResult = parseAuthorizeResult(keychainResult.password)
  if (!restoredAuthorizeResult) {
    return
  }

  // Persist the restored authorization result in memory for the rest of the session.
  authStore.setState({ authorizeResult: restoredAuthorizeResult })

  // Look into the preferences store for hasOnboardedPinCode, if the value is false, this looks like a fresh install.
  const hasOnboardedPinCode =
    preferencesStore.getState().hasOnboardedPinCode ?? false

  // Fresh installs should clear out any surviving keychain credentials unless we've already done so once.
  if (!hasOnboardedPinCode && Platform.OS === 'ios') {
    await forceLogoutAfterFreshInstall()
    return
  }
}

async function readStoredAuthorizeCredentials(): Promise<KeychainAuthorizeCredentials> {
  try {
    return await Keychain.getGenericPassword({
      service: KEYCHAIN_AUTH_KEY,
      // authenticationPrompt: Keychain.ACCESSIBLE.AFTER_FIRST_UNLOCK_THIS_DEVICE_ONLY
      // accessible: Keychain.ACCESSIBLE.AFTER_FIRST_UNLOCK_THIS_DEVICE_ONLY,
    })
  } catch (err) {
    console.log('Unable to read from keystore: ', err)
    return false
  }
}

/**
 * A native login keeps only who is signed in, and starts locked. Returns
 * false when there's no native login.
 */
async function restoreNativeUser(): Promise<boolean> {
  let nativeUser: UserInfo
  try {
    const stored = await Keychain.getGenericPassword({
      service: KEYCHAIN_NATIVE_USER_KEY,
    })
    if (!stored) {
      return false
    }
    nativeUser = JSON.parse(stored.password) as UserInfo
  } catch (err) {
    console.log('Unable to read the native login: ', err)
    return false
  }
  // Locked, so userinfo can't be fetched: the stored copy is the same data.
  authStore.setState({ nativeUser, userInfo: nativeUser })

  // The same fresh install check as for a browser login.
  const hasOnboardedPinCode =
    preferencesStore.getState().hasOnboardedPinCode ?? false
  if (!hasOnboardedPinCode && Platform.OS === 'ios') {
    await forceLogoutAfterFreshInstall()
  }
  return true
}

async function forceLogoutAfterFreshInstall(): Promise<void> {
  try {
    await authStore.getState().logout(true)
  } catch (err) {
    console.log('Unable to force logout after fresh install: ', err)
  }
}

function parseAuthorizeResult(
  serializedAuthorizeResult: string,
): AuthorizeResult | RefreshResult | undefined {
  try {
    return JSON.parse(serializedAuthorizeResult) as
      | AuthorizeResult
      | RefreshResult
  } catch (err) {
    console.log('Unable to parse authorize result: ', err)
    return undefined
  }
}

// Function used in getAppRoot to check if user is authenticated and show login screen if not
export async function checkIsAuthenticated() {
  const intl = getIntl()
  const appAuthConfig = getAppAuthConfig()
  const { authorizeResult, nativeUser, fetchUserInfo, logout } =
    authStore.getState()

  if (!authorizeResult) {
    // A locked native login: the lock screen gets its tokens.
    return !!nativeUser
  }

  if ('scopes' in authorizeResult) {
    const requiredScopes = appAuthConfig.scopes.filter(
      (scope) => !OPTIONAL_SCOPES.includes(scope),
    )
    const hasRequiredScopes = requiredScopes.every((scope) =>
      authorizeResult.scopes.includes(scope),
    )
    if (!hasRequiredScopes) {
      Alert.alert(
        intl.formatMessage({ id: 'login.expiredTitle' }),
        intl.formatMessage({ id: 'login.expiredScopesMessage' }),
      )

      await logout()

      return false
    }
  }

  if (!offlineStore.getState().isConnected) {
    return true
  }

  try {
    // Fetch user info, skip logout if refresh token fails. Instead, handle it locally.
    // The reason for that is getAppRoot => checkIsAuthenticated => fetchUserInfo => refresh => getAppRoot if refresh fails, resulting in an infinite loop.
    await fetchUserInfo(false, true)

    return true
  } catch (e) {
    if (!isLogoutError(e as Error & { code?: string })) {
      return true
    }

    Alert.alert(
      intl.formatMessage({ id: 'login.expiredTitle' }),
      intl.formatMessage({ id: 'login.expiredMissingUserMessage' }),
    )
    await logout()

    return false
  }
}
