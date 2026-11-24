import { Alert, Platform } from 'react-native'
import Keychain from 'react-native-keychain'
import { deleteToken } from '@react-native-firebase/messaging'

import { bundleId, getConfig } from '../config'
import {
  APP_LOCK_TIMEOUT_MS,
  LOCK_SCREEN_SUPPRESS_MAX_MS,
} from '../constants/auth'
import { getIntl } from '../components/providers/locale-provider'
import { getApolloClientAsync } from '../graphql/client-instance'
import { didPreferencesLoad, preferencesStore } from './preferences-store'
import { notificationsStore } from './notifications-store'
import { getFeatureFlagValue } from '../lib/feature-flag-client'
import { getIasClient, isAppLoginRemoved, isNativeLogin } from '../lib/ias'
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
const USER_INFO_TIMEOUT_MS = 30_000
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
  // While a system dialog the app asked for is up (see whileSystemDialog).
  systemDialogUntil: number | undefined
  // Auto-prompt biometrics at most once per lock session (loop guard).
  biometricAutoPromptedForCurrentLock: boolean
  /**
   * Changes when someone logs in and when a logout starts, so work started
   * for an earlier login, such as an unlock, can tell it's out of date.
   */
  session: number
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
    e.message === UNAUTHORIZED_USER_INFO ||
    isAppLoginRemoved(e)
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
  systemDialogUntil: undefined,
  biometricAutoPromptedForCurrentLock: false,
  session: 0,
  isCogitoAuth: false,
  cognitoDismissCount: 0,
  cognitoAuthUrl: undefined,
  cookies: '',
  async fetchUserInfo(skipRefresh = false, skipLogoutIfRefreshFailed = false) {
    // A native login's tokens come from IAS. Its userinfo still only reads
    // Bearer, even for DPoP tokens.
    const issuer = getConfig().idsIssuer
    // Detect expired token
    const expiresAt = get().authorizeResult?.accessTokenExpirationDate ?? 0

    if (!skipRefresh && new Date(expiresAt) < new Date()) {
      await get().refresh(skipLogoutIfRefreshFailed)
    }

    // A login waits for this with no way to cancel it, so it has a limit. As
    // a TimeoutError, not an AbortError, it fails the login rather than
    // looking like the person cancelled it.
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), USER_INFO_TIMEOUT_MS)
    let res: Response
    try {
      res = await fetch(`${issuer.replace(/\/$/, '')}/connect/userinfo`, {
        headers: {
          Authorization: `Bearer ${get().authorizeResult?.accessToken}`,
        },
        signal: controller.signal,
      })
    } catch (error) {
      if (controller.signal.aborted) {
        throw Object.assign(new Error("Userinfo didn't answer in time"), {
          name: 'TimeoutError',
        })
      }
      throw error
    } finally {
      clearTimeout(timer)
    }

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

    // The app locked, logged out or unlocked again while the refresh was out:
    // that session is over, and its tokens mustn't come back.
    const isSuperseded = () => get().authorizeResult !== authorizeResult
    // The issuer the refresh token is from, also if the environment changes.
    const ias = getIasClient()

    let tokens
    try {
      tokens = await ias.refresh(authorizeResult.refreshToken)
    } catch (e) {
      // The lock revokes the refresh token, so this one may fail for that.
      if (isSuperseded()) {
        throw e
      }
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

    if (isSuperseded()) {
      void ias
        .revoke(tokens.refreshToken)
        .catch((error) => console.log('Failed to revoke the refresh', error))
      return
    }

    // A native login's tokens stay in memory: a restart needs an unlock.
    set({ authorizeResult: { ...authorizeResult, ...tokens } })
  }),
  async loginNative(tokens) {
    set((state) => ({ authorizeResult: tokens, session: state.session + 1 }))
    let userInfo: UserInfo
    try {
      userInfo = await get().fetchUserInfo(true)
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
    } catch (error) {
      // Not logged in after all: no tokens without a user, and no app login
      // left behind on IAS.
      set({ authorizeResult: undefined, userInfo: undefined })
      void getIasClient()
        .logout(tokens.refreshToken)
        .catch((e) => console.log('Failed to end the app login', e))
      throw error
    }
    preferencesStore.setState({ hasLoggedIn: true, showReloginNotice: false })
    set({ nativeUser: userInfo })
    revokeBrowserLogin()
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
    // Before the first wait: an unlock that finishes during the logout is for
    // the session being ended.
    set((state) => ({ session: state.session + 1 }))

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
      // Ends the app login on IAS, not just this session. Works locked too.
      await endAppLogin(authorizeResult?.refreshToken ?? undefined)
    }

    // Logged out in the app even if clearing these fails: a login left in the
    // keychain is cleared at the next start, as after a reinstall (iOS), or
    // when its unlock finds the app login gone. Each on its own, so one
    // failing doesn't keep the others.
    const cleared = await Promise.allSettled([
      getApolloClientAsync().then((client) => client.clearStore()),
      Keychain.resetGenericPassword({ service: KEYCHAIN_AUTH_KEY }),
      Keychain.resetGenericPassword({ service: KEYCHAIN_NATIVE_USER_KEY }),
    ])
    for (const result of cleared) {
      if (result.status === 'rejected') {
        console.log('Failed to clear the stored login', result.reason)
      }
    }
    set(
      (state) => ({
        ...state,
        authorizeResult: undefined,
        userInfo: undefined,
        nativeUser: undefined,
        lockScreenActivatedAt: undefined,
        lockScreenPushPending: false,
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

/**
 * Shows a system dialog the app asked for, such as a permission prompt. iOS
 * makes the app inactive while it's up, which would put up the lock. Unlike
 * suppressLockScreen(), going to the background still locks the app.
 */
export async function whileSystemDialog<T>(show: () => Promise<T>) {
  authStore.setState({
    systemDialogUntil: Date.now() + LOCK_SCREEN_SUPPRESS_MAX_MS,
  })
  try {
    return await show()
  } finally {
    authStore.setState({ systemDialogUntil: undefined })
  }
}

export function isSystemDialogShowing() {
  const until = authStore.getState().systemDialogUntil
  return until != null && Date.now() < until
}

/**
 * Locked for longer than the grace period: only an unlock opens the app, and
 * the tokens from before it are about to go.
 */
export function isLockPastGracePeriod() {
  const lockedAt = authStore.getState().lockScreenActivatedAt
  return lockedAt !== undefined && Date.now() - lockedAt >= APP_LOCK_TIMEOUT_MS
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
  void clearLegacyKeychain()

  // We already have tokens in memory, nothing else to do.
  if (authStore.getState().authorizeResult) {
    return
  }

  // Older versions logged in through the browser. Those tokens can't be
  // refreshed any more, so the person logs in again.
  const browserLogin = await readBrowserLogin()
  if (browserLogin) {
    browserRefreshToken = browserLogin.refreshToken ?? undefined
    // Logging out resets the preferences, but the notice is in their language.
    const { locale } = preferencesStore.getState()
    await forceLogout()
    preferencesStore.setState({ locale, showReloginNotice: true })
    return
  }

  await restoreNativeUser()
}

// Older versions' PIN, and on iOS the snapshot of enrolled biometrics they
// used to notice changes. Can go once nobody updates from those versions.
async function clearLegacyKeychain() {
  const services =
    Platform.OS === 'ios'
      ? ['PIN_CODE', 'is.island.biometric-integrity']
      : ['PIN_CODE']
  for (const service of services) {
    await Keychain.resetGenericPassword({ service }).catch((err) =>
      console.log(`Unable to clear ${service}: `, err),
    )
  }
}

/** The browser login's tokens, as older versions kept them. */
async function readBrowserLogin(): Promise<{
  refreshToken?: string | null
} | null> {
  let stored
  try {
    stored = await Keychain.getGenericPassword({ service: KEYCHAIN_AUTH_KEY })
  } catch (err) {
    console.log('Unable to read from keystore: ', err)
    return null
  }
  if (!stored) {
    return null
  }
  try {
    return JSON.parse(stored.password)
  } catch {
    // Still a login to replace, just nothing to revoke.
    return {}
  }
}

// The upgraded browser login's refresh token, until a native login can
// revoke it: revoking needs the install's attestation, which logging in
// creates. Kept in memory only, so it's lost if the app restarts first.
let browserRefreshToken: string | undefined

function revokeBrowserLogin() {
  const refreshToken = browserRefreshToken
  browserRefreshToken = undefined
  if (refreshToken) {
    void getIasClient()
      .revoke(refreshToken)
      .catch((error) =>
        console.log('Failed to revoke the browser login', error),
      )
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
  // The keychain survives reinstalling on iOS: a fresh install doesn't pick
  // up the login from before, not even while it's cleared. Preferences that
  // couldn't be read say nothing about a reinstall, so the login stands, and
  // the flag is saved again.
  if (!preferencesStore.getState().hasLoggedIn && Platform.OS === 'ios') {
    if (!didPreferencesLoad()) {
      preferencesStore.setState({ hasLoggedIn: true })
    } else {
      await endAppLogin()
      await forceLogout()
      return false
    }
  }

  // Locked, so userinfo can't be fetched: the stored copy is the same data.
  authStore.setState({ nativeUser, userInfo: nativeUser })
  return true
}

// Logging out waits this long for IAS at most. The phone is cleared either
// way, and ending the app login on IAS carries on in the background.
const END_APP_LOGIN_WAIT_MS = 5_000

/** Ends the install's app login on IAS. */
async function endAppLogin(refreshToken?: string) {
  const ending = getIasClient()
    .logout(refreshToken)
    .catch((e) => console.log('Failed to end the app login', e))
  await Promise.race([
    ending,
    new Promise((resolve) => setTimeout(resolve, END_APP_LOGIN_WAIT_MS)),
  ])
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
