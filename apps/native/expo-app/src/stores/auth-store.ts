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
import { Navigation } from 'react-native-navigation'

import { bundleId, getConfig } from '../config'
import { getIntl } from '../components/providers/locale-provider'
import { getApolloClientAsync } from '../graphql/client'
import { isAndroid } from '../utils/devices'
import { offlineStore } from './offline-store'
import { preferencesStore } from './preferences-store'
import { notificationsStore } from './notifications-store'
import { featureFlagClient } from '../components/providers/feature-flag-provider'
import {
  DeletePasskeyDocument,
  DeletePasskeyMutation,
  DeletePasskeyMutationVariables,
} from '../graphql/types/schema'
import { getAppRoot } from '../utils/lifecycle/get-app-root'
import { deduplicatePromise } from '../utils/deduplicatePromise'
import type { User } from 'configcat-js'
import { clearWidgetData } from '../lib/widget-sync'
import { create, useStore } from 'zustand'
import { clearAllStorages } from './mmkv'

const KEYCHAIN_AUTH_KEY = `@islandis_${bundleId}`
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
  lockScreenActivatedAt?: number
  lockScreenComponentId: string | undefined
  noLockScreenUntilNextAppStateActive: boolean
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
  logout(skipPasskeyDeletion?: boolean): Promise<boolean>
}

const getAppAuthConfig = () => {
  const config = getConfig()
  const android = isAndroid ? '.auth' : ''

  return {
    issuer: config.idsIssuer,
    clientId: config.idsClientId,
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
  const isPasskeyEnabled = await featureFlagClient?.getValueAsync(
    'isPasskeyEnabled',
    false,
    userNationalId ? ({ identifier: userNationalId } as User) : undefined,
  )

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
  lockScreenActivatedAt: undefined,
  lockScreenComponentId: undefined,
  noLockScreenUntilNextAppStateActive: false,
  isCogitoAuth: false,
  cognitoDismissCount: 0,
  cognitoAuthUrl: undefined,
  cookies: '',
  async fetchUserInfo(skipRefresh = false, skipLogoutIfRefreshFailed = false) {
    const appAuthConfig = getAppAuthConfig()
    // Detect expired token
    const expiresAt = get().authorizeResult?.accessTokenExpirationDate ?? 0

    if (!skipRefresh && new Date(expiresAt) < new Date()) {
      await get().refresh(skipLogoutIfRefreshFailed)
    }

    const res = await fetch(
      `${appAuthConfig.issuer.replace(/\/$/, '')}/connect/userinfo`,
      {
        headers: {
          Authorization: `Bearer ${get().authorizeResult?.accessToken}`,
        },
      },
    )

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
      newAuthorizeResult = await authRefresh(appAuthConfig, {
        refreshToken,
      })
    } catch (e) {
      if (!skipLogout && isLogoutError(e as Error & { code?: string })) {
        Alert.alert(
          intl.formatMessage({ id: 'login.expiredTitle' }),
          intl.formatMessage({ id: 'login.expiredMessage' }),
        )

        await get().logout(true)
        await Navigation.setRoot({ root: await getAppRoot() })
      }
      throw e
    }

    const authorizeResult = {
      ...get().authorizeResult,
      ...newAuthorizeResult,
    }

    await Keychain.setGenericPassword(
      KEYCHAIN_AUTH_KEY,
      JSON.stringify(authorizeResult),
      {
        service: KEYCHAIN_AUTH_KEY,
        accessible: Keychain.ACCESSIBLE.AFTER_FIRST_UNLOCK_THIS_DEVICE_ONLY,
      },
    )
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
      },
    })

    if (authorizeResult) {
      await Keychain.setGenericPassword(
        KEYCHAIN_AUTH_KEY,
        JSON.stringify(authorizeResult),
        {
          service: KEYCHAIN_AUTH_KEY,
          accessible: Keychain.ACCESSIBLE.AFTER_FIRST_UNLOCK_THIS_DEVICE_ONLY,
        },
      )
      set({ authorizeResult })
      return true
    }
    return false
  },
  async logout(skipPasskeyDeletion = false) {
    // Clear all MMKV storages
    clearAllStorages()

    // Clear widgets
    clearWidgetData()

    // Clear push token if exists
    const pushToken = notificationsStore.getState().pushToken
    if (pushToken) {
      void notificationsStore.getState().deletePushToken(pushToken)
    }
    notificationsStore.getState().reset()

    // Clear passkey if exists, can't delete passkeys if no auth token
    if (!skipPasskeyDeletion) {
      const userNationalId = get().userInfo?.nationalId
      await clearPasskey(userNationalId)
    }

    const appAuthConfig = getAppAuthConfig()
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const tokenToRevoke = get().authorizeResult?.accessToken;
    try {
      if (tokenToRevoke) {
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
    set(
      (state) => ({
        ...state,
        authorizeResult: undefined,
        userInfo: undefined,
      }),
      true,
    )
    // Reset all preferences
    preferencesStore.getState().reset()

    return true
  },
}))

export const useAuthStore = <U = AuthStore>(
  selector?: (state: AuthStore) => U,
) => useStore(authStore, selector!)

export async function readAuthorizeResult(): Promise<void> {
  const { authorizeResult } = authStore.getState()

  // We already have an authorization result in memory, nothing else to do.
  if (authorizeResult) {
    return
  }

  // Attempt to restore the last known authorization data from the secure keychain.
  const keychainResult = await readStoredAuthorizeCredentials()
  if (!keychainResult) {
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
  const { authorizeResult, fetchUserInfo, logout } = authStore.getState()

  if (!authorizeResult) {
    return false
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
