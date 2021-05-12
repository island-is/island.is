import create, { State } from 'zustand/vanilla';
import createUse from 'zustand';
import { authorize, refresh, revoke, AuthorizeResult, RefreshResult, AuthConfiguration } from 'react-native-app-auth';
import Keychain from 'react-native-keychain';
import { config } from '../utils/config';
import { preferencesStore } from './preferences-store';

const KEYCHAIN_AUTH_KEY = `@islandis_${config.bundleId}`

interface UserInfo {
  sub: string;
  nationalId: string;
  name: string;
  nat: string;
}

interface AuthStore extends State {
  authorizeResult: AuthorizeResult | RefreshResult | undefined;
  userInfo: UserInfo | undefined;
  lockScreenActivatedAt: number | undefined;
  lockScreenComponentId: string | undefined;
  lockScreenType: 'root' | 'overlay';
  isCogitoAuth: boolean;
  fetchUserInfo(): Promise<UserInfo>;
  refresh(): Promise<boolean>
  login(): Promise<boolean>;
  logout(): Promise<boolean>;
}

const appAuthConfig: AuthConfiguration = {
  issuer: config.identityServer.issuer,
  clientId: config.identityServer.clientId,
  redirectUrl: `${config.bundleId}://oauth`,
  scopes: config.identityServer.scopes,
};

export const authStore = create<AuthStore>((set, get) => ({
  authorizeResult: undefined,
  userInfo: undefined,
  lockScreenActivatedAt: undefined,
  lockScreenComponentId: undefined,
  lockScreenType: 'root',
  isCogitoAuth: false,
  async fetchUserInfo() {
    return fetch(`${appAuthConfig.issuer.replace(/\/$/, '')}/connect/userinfo`, {
      headers: {
        Authorization: `Bearer ${get().authorizeResult?.accessToken}`,
      }
    })
    .then(async res => {
      if (res.status === 401) {
        // Attempt to refresh the access token
        const wasRefreshed = await this.refresh();
        if (wasRefreshed) {
          // Retry the userInfo call
          return this.fetchUserInfo();
        } else {
          return false;
        }
      }
      const userInfo = await res.json();
      set({ userInfo });
      return userInfo;
    })
  },
  async refresh() {
    const authorizeResult = {
      ...get().authorizeResult,
      ...await refresh(appAuthConfig, { refreshToken: get().authorizeResult?.refreshToken! })
    };
    if (authorizeResult) {
      await Keychain.setGenericPassword(KEYCHAIN_AUTH_KEY, JSON.stringify(authorizeResult), { service: KEYCHAIN_AUTH_KEY });
      set({ authorizeResult });
      return true;
    }
    return false;
  },
  async login() {
    const authorizeResult = await authorize({
      ...appAuthConfig,
      additionalParameters: {
        ui_locales: preferencesStore.getState().locale,
      },
    });
    if (authorizeResult) {
      await Keychain.setGenericPassword(KEYCHAIN_AUTH_KEY, JSON.stringify(authorizeResult), { service: KEYCHAIN_AUTH_KEY });
      set({ authorizeResult });
      return true;
    }
    return false;
  },
  async logout() {
    const tokenToRevoke = get().authorizeResult?.accessToken!;
    await revoke(appAuthConfig, {
      tokenToRevoke,
      includeBasicAuth: true,
      sendClientId: true,
    });
    await Keychain.resetGenericPassword({ service: KEYCHAIN_AUTH_KEY });
    set(state => ({ ...state, authorizeResult: undefined, userInfo: undefined }), true);
    return true;
  }
}));

export const useAuthStore = createUse(authStore);

export async function checkIsAuthenticated() {
  // Fetch initial authorization result from keychain
  try {
    const res = await Keychain.getGenericPassword({ service: KEYCHAIN_AUTH_KEY });
    if (res) {
      const authorizeResult = JSON.parse(res.password);
      authStore.setState({ authorizeResult });
    }
    if (!res) {
      return false;
    }
  } catch (err) {
    console.log('Unable to read from keystore: ', err);
  }

  // console.log(authStore.getState().authorizeResult!.accessToken);

  // Attempt to fetch user info (validate the token is all good)
  try {
    const userInfo = await authStore.getState().fetchUserInfo();
    return !!userInfo;
  } catch (err) {
    // noop
  }

  return false;
}
