import { Alert, Platform } from 'react-native'
import Keychain from 'react-native-keychain'
import { deleteToken } from '@react-native-firebase/messaging'

import { bundleId } from '../config'
import { LOCK_SCREEN_SUPPRESS_MAX_MS } from '../constants/auth'
import { getIntl } from '../components/providers/locale-provider'
import { getApolloClientAsync } from '../graphql/client-instance'
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
import { clearWidgetData } from '../lib/widget-sync'
import { app } from '../lib/firebase'
import { setAuthStoreRef } from './auth-store-ref'
import { create, useStore } from 'zustand'
import { clearAllStorages } from './mmkv'
import { router } from 'expo-router'

// Where older versions kept the browser login's tokens.
const KEYCHAIN_AUTH_KEY = `@islandis_${bundleId}`
const KEYCHAIN_NATIVE_USER_KEY = `@islandis_${bundleId}_native`
const INVALID_REFRESH_TOKEN_ERROR = 'invalid_grant'
const UNAUTHORIZED_USER_INFO = 'Got 401 when fetching user info'

interface UserInfo {
  sub: string
  nationalId: string
  name: string
}

/**
 * A native login's tokens. The Mock environment's are Bearer tokens with no
 * IAS behind them.
 */
type AuthTokens = Omit<IasTokens, 'tokenType'> & {
  tokenType: IasTokens['tokenType'] | 'Bearer'
}

interface AuthStore {
  authorizeResult: AuthTokens | undefined
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
  /** Signs in with a native login's tokens. */
  loginNative(tokens: IasTokens): Promise<UserInfo>
  /** Revokes and forgets a native login's tokens; stays signed in. */
  lockNative(): Promise<void>
  /** Tokens from a biometric or electronic ID unlock. */
  unlockNative(tokens: IasTokens): void
  logout(skipPasskeyDeletion?: boolean): Promise<boolean>
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
    const issuer = getIasIssuer()
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
    const { authorizeResult } = get()

    // The Mock environment's tokens have nothing to refresh them with.
    if (!isNativeLogin(authorizeResult) || !authorizeResult?.refreshToken) {
      return
    }

    let tokens
    try {
      tokens = await getIasClient().refresh(authorizeResult.refreshToken)
    } catch (e) {
      if (!skipLogout && isLogoutError(e as Error & { code?: string })) {
        Alert.alert(
          intl.formatMessage({ id: 'login.expiredTitle' }),
          intl.formatMessage({ id: 'login.expiredMessage' }),
        )

        await get().logout(true)
        router.replace('/login')
      }
      throw e
    }

    // A native login's tokens stay in memory: a restart needs an unlock.
    set({ authorizeResult: { ...authorizeResult, ...tokens } })
  }),
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
    // apart from one that was logged in (see restoreNativeUser).
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

    const { authorizeResult, nativeUser } = get()
    if (nativeUser || isNativeLogin(authorizeResult)) {
      try {
        // Ends the app login on IAS, not just this session. Works locked too.
        await getIasClient().logout(authorizeResult?.refreshToken ?? undefined)
      } catch (e) {
        console.log('Failed to end the app login', e)
      }
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
 * only an unlock gets its tokens back.
 */
export function isAppLockEnabled() {
  return !!authStore.getState().nativeUser
}

/** At startup: restores who is signed in, locked. */
export async function readAuthorizeResult(): Promise<void> {
  // We already have tokens in memory, nothing else to do.
  if (authStore.getState().authorizeResult) {
    return
  }

  // Older versions logged in through the browser. Those tokens can't be
  // refreshed any more, so the person logs in again.
  if (await hasBrowserLogin()) {
    await forceLogout()
    return
  }

  await restoreNativeUser()
}

async function hasBrowserLogin(): Promise<boolean> {
  try {
    return !!(await Keychain.getGenericPassword({ service: KEYCHAIN_AUTH_KEY }))
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

  // The keychain survives reinstalling on iOS: a fresh install shouldn't
  // pick up the login from before.
  const hasOnboardedPinCode =
    preferencesStore.getState().hasOnboardedPinCode ?? false
  if (!hasOnboardedPinCode && Platform.OS === 'ios') {
    await forceLogout()
  }
  return true
}

async function forceLogout(): Promise<void> {
  try {
    await authStore.getState().logout(true)
  } catch (err) {
    console.log('Unable to force logout: ', err)
  }
}

/**
 * At startup: whether someone is signed in. A native login's tokens are only
 * kept in memory, so it starts locked and the lock screen gets new ones.
 */
export async function checkIsAuthenticated() {
  return !!authStore.getState().nativeUser
}
