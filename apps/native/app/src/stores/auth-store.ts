import { Alert } from 'react-native'
import {
  authorize,
  AuthorizeResult,
  refresh as authRefresh,
  RefreshResult,
  revoke,
} from 'react-native-app-auth'
import Keychain from 'react-native-keychain'
import createUse from 'zustand'
import create, { State } from 'zustand/vanilla'
import { Navigation } from 'react-native-navigation'

import { bundleId, getConfig } from '../config'
import { getIntl } from '../contexts/i18n-provider'
import { getApolloClientAsync } from '../graphql/client'
import { isAndroid } from '../utils/devices'
import { offlineStore } from './offline-store'
import { preferencesStore } from './preferences-store'
import { clearAllStorages } from '../stores/mmkv'
import { notificationsStore } from './notifications-store'
import { featureFlagClient } from '../contexts/feature-flag-provider'
import {
  DeletePasskeyDocument,
  DeletePasskeyMutation,
  DeletePasskeyMutationVariables,
} from '../graphql/types/schema'
import { getAppRoot } from '../utils/lifecycle/get-app-root'
import { deduplicatePromise } from '../utils/deduplicatePromise'

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

interface AuthStore extends State {
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
  const android = isAndroid && !config.isTestingApp ? '.auth' : ''

  return {
    issuer: config.idsIssuer,
    clientId: config.idsClientId,
    redirectUrl: `${config.bundleId}${android}://oauth`,
    scopes: config.idsScopes,
  }
}

const clearPasskey = async (userNationalId?: string) => {
  // Clear passkey if exists
  const isPasskeyEnabled = await featureFlagClient?.getValueAsync(
    'isPasskeyEnabled',
    false,
    userNationalId ? { identifier: userNationalId } : undefined,
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
      { service: KEYCHAIN_AUTH_KEY },
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
        { service: KEYCHAIN_AUTH_KEY },
      )
      set({ authorizeResult })
      return true
    }
    return false
  },
  async logout(skipPasskeyDeletion = false) {
    // Clear all MMKV storages
    clearAllStorages()

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
    const tokenToRevoke = get().authorizeResult!.accessToken!
    try {
      await revoke(appAuthConfig, {
        tokenToRevoke,
        includeBasicAuth: true,
        sendClientId: true,
      })
    } catch (e) {
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

export const useAuthStore = createUse(authStore)

export async function readAuthorizeResult(): Promise<void> {
  const { authorizeResult } = authStore.getState()

  if (authorizeResult) {
    return
  }

  try {
    const res = await Keychain.getGenericPassword({
      service: KEYCHAIN_AUTH_KEY,
    })

    if (res) {
      const authRes = JSON.parse(res.password)
      authStore.setState({ authorizeResult: authRes })
    }
  } catch (err) {
    console.log('Unable to read from keystore: ', err)
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
