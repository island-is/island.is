import {
  AuthConfiguration,
  authorize,
  AuthorizeResult,
  refresh,
  RefreshResult,
  revoke,
} from 'react-native-app-auth'
import Keychain from 'react-native-keychain'
import { Navigation } from 'react-native-navigation'
import createUse from 'zustand'
import create, { State } from 'zustand/vanilla'
import { client } from '../graphql/client'
import { config } from '../utils/config'
import { zustandFlipper } from '../utils/devtools/flipper-zustand'
import { getAppRoot } from '../utils/lifecycle/get-app-root'
// import { inboxStore } from './inbox-store'
// import { notificationsStore } from './notifications-store'
import { preferencesStore } from './preferences-store'

const KEYCHAIN_AUTH_KEY = `@islandis_${config.bundleId}`

interface UserInfo {
  sub: string
  nationalId: string
  name: string
  nat: string
}

interface AuthStore extends State {
  authorizeResult: AuthorizeResult | RefreshResult | undefined
  userInfo: UserInfo | undefined
  lockScreenActivatedAt: number | undefined
  lockScreenComponentId: string | undefined
  noLockScreenUntilNextAppStateActive: boolean
  isCogitoAuth: boolean
  cognitoDismissCount: number
  cognitoAuthUrl?: string
  cookies: string
  fetchUserInfo(_refresh?: boolean): Promise<UserInfo>
  refresh(): Promise<boolean>
  login(): Promise<boolean>
  logout(): Promise<boolean>
}

const appAuthConfig: AuthConfiguration = {
  issuer: config.identityServer.issuer,
  clientId: config.identityServer.clientId,
  redirectUrl: `${config.bundleId}://oauth`,
  scopes: config.identityServer.scopes,
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
  async fetchUserInfo(_refresh: boolean = false) {
    return fetch(
      `${appAuthConfig.issuer.replace(/\/$/, '')}/connect/userinfo`,
      {
        headers: {
          Authorization: `Bearer ${get().authorizeResult?.accessToken}`,
        },
      },
    ).then(async (res) => {
      if (res.status === 401) {
        // Attempt to refresh the access token
        if (!_refresh && (await get().refresh())) {
          // Retry the userInfo call
          return get().fetchUserInfo(true)
        }
        throw new Error('Unauthorized')
      } else if (res.status === 200) {
        const userInfo = await res.json()
        set({ userInfo })
        return userInfo
      }
      return undefined
    })
  },
  async refresh() {
    const authorizeResult = {
      ...get().authorizeResult,
      ...(await refresh(appAuthConfig, {
        refreshToken: get().authorizeResult?.refreshToken!,
      })),
    }
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
  async login() {
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
  async logout() {
    const tokenToRevoke = get().authorizeResult?.accessToken!
    await revoke(appAuthConfig, {
      tokenToRevoke,
      includeBasicAuth: true,
      sendClientId: true,
    })
    await client.cache.reset()
    await Keychain.resetGenericPassword({ service: KEYCHAIN_AUTH_KEY })
    set(
      (state) => ({
        ...state,
        authorizeResult: undefined,
        userInfo: undefined,
      }),
      true,
    )
    return true
  },
}))

// authStore.subscribe((userInfo: UserInfo | undefined) => {
//   inboxStore.getState().actions.setNationalId(userInfo?.nationalId ?? null);
//   // notificationsStore.getState().actions.setNationalId(userInfo?.nationalId);
// }, s => s.userInfo);

export const useAuthStore = createUse(authStore)

export async function readAuthorizeResult(): Promise<AuthorizeResult | null> {
  const { authorizeResult } = authStore.getState()

  if (authorizeResult) {
    return authorizeResult as AuthorizeResult
  }

  try {
    const res = await Keychain.getGenericPassword({
      service: KEYCHAIN_AUTH_KEY,
    })
    if (res) {
      const authRes = JSON.parse(res.password)
      authStore.setState({ authorizeResult: authRes })
      return authRes
    }
  } catch (err) {
    console.log('Unable to read from keystore: ', err)
  }

  return null
}

export async function checkIsAuthenticated() {
  const { authorizeResult, fetchUserInfo, logout } = authStore.getState()

  if (!authorizeResult) {
    return false
  }

  return true
}

zustandFlipper(authStore, 'AuthStore')
