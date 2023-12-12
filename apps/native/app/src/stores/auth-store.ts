import {
  authorize,
  AuthorizeResult,
  refresh,
  RefreshResult,
  revoke,
} from 'react-native-app-auth';
import Keychain from 'react-native-keychain';
import {Navigation} from 'react-native-navigation';
import createUse from 'zustand';
import create, {State} from 'zustand/vanilla';
import {client} from '../graphql/client';
import {getConfig, bundleId} from '../config';
import {getAppRoot} from '../utils/lifecycle/get-app-root';
import {preferencesStore} from './preferences-store';
import {Platform} from 'react-native';

const KEYCHAIN_AUTH_KEY = `@islandis_${bundleId}`;

interface UserInfo {
  sub: string;
  nationalId: string;
  name: string;
}

interface AuthStore extends State {
  authorizeResult: AuthorizeResult | RefreshResult | undefined;
  userInfo: UserInfo | undefined;
  lockScreenActivatedAt: number | undefined;
  lockScreenComponentId: string | undefined;
  noLockScreenUntilNextAppStateActive: boolean;
  isCogitoAuth: boolean;
  cognitoDismissCount: number;
  cognitoAuthUrl?: string;
  cookies: string;
  fetchUserInfo(_refresh?: boolean): Promise<UserInfo>;
  refresh(): Promise<boolean>;
  login(): Promise<boolean>;
  logout(): Promise<boolean>;
}

const getAppAuthConfig = () => {
  const config = getConfig();
  const android =
    Platform.OS === 'android' && !config.isTestingApp ? '.auth' : '';
  return {
    issuer: config.idsIssuer,
    clientId: config.idsClientId,
    redirectUrl: `${config.bundleId}${android}://oauth`,
    scopes: config.idsScopes,
  };
};

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
  async fetchUserInfo(_refresh = false) {
    const appAuthConfig = getAppAuthConfig();
    // Detect expired token
    const expiresAt = get().authorizeResult?.accessTokenExpirationDate ?? 0;
    if (new Date(expiresAt) < new Date()) {
      await get().refresh();
    }
    return fetch(
      `${appAuthConfig.issuer.replace(/\/$/, '')}/connect/userinfo`,
      {
        headers: {
          Authorization: `Bearer ${get().authorizeResult?.accessToken}`,
        },
      },
    ).then(async res => {
      if (res.status === 401) {
        // Attempt to refresh the access token
        if (!_refresh && (await get().refresh())) {
          // Retry the userInfo call
          return get().fetchUserInfo(true);
        }
        throw new Error('Unauthorized');
      } else if (res.status === 200) {
        const userInfo = await res.json();
        set({userInfo});
        return userInfo;
      }
      return undefined;
    });
  },
  async refresh() {
    const appAuthConfig = getAppAuthConfig();
    const authorizeResult = {
      ...get().authorizeResult,
      ...(await refresh(appAuthConfig, {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        refreshToken: get().authorizeResult!.refreshToken!,
      })),
    };
    if (authorizeResult) {
      await Keychain.setGenericPassword(
        KEYCHAIN_AUTH_KEY,
        JSON.stringify(authorizeResult),
        {service: KEYCHAIN_AUTH_KEY},
      );
      set({authorizeResult});
      return true;
    }
    return false;
  },
  async login() {
    const appAuthConfig = getAppAuthConfig();
    const authorizeResult = await authorize({
      ...appAuthConfig,
      additionalParameters: {
        prompt: 'login',
        prompt_delegations: 'true',
        ui_locales: preferencesStore.getState().locale,
        externalUserAgent: 'yes',
      },
    });
    if (authorizeResult) {
      await Keychain.setGenericPassword(
        KEYCHAIN_AUTH_KEY,
        JSON.stringify(authorizeResult),
        {service: KEYCHAIN_AUTH_KEY},
      );
      set({authorizeResult});
      return true;
    }
    return false;
  },
  async logout() {
    const appAuthConfig = getAppAuthConfig();
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const tokenToRevoke = get().authorizeResult!.accessToken!;
    try {
      await revoke(appAuthConfig, {
        tokenToRevoke,
        includeBasicAuth: true,
        sendClientId: true,
      });
    } catch (e) {
      // NOOP
    }
    await client.cache.reset();
    await Keychain.resetGenericPassword({service: KEYCHAIN_AUTH_KEY});
    set(
      state => ({
        ...state,
        authorizeResult: undefined,
        userInfo: undefined,
      }),
      true,
    );
    return true;
  },
}));

export const useAuthStore = createUse(authStore);

export async function readAuthorizeResult(): Promise<AuthorizeResult | null> {
  const {authorizeResult} = authStore.getState();

  if (authorizeResult) {
    return authorizeResult as AuthorizeResult;
  }

  try {
    const res = await Keychain.getGenericPassword({
      service: KEYCHAIN_AUTH_KEY,
    });
    if (res) {
      const authRes = JSON.parse(res.password);
      authStore.setState({authorizeResult: authRes});
      return authRes;
    }
  } catch (err) {
    console.log('Unable to read from keystore: ', err);
  }

  return null;
}

export async function checkIsAuthenticated() {
  const appAuthConfig = getAppAuthConfig();
  const {authorizeResult, fetchUserInfo, logout} = authStore.getState();

  if (!authorizeResult) {
    return false;
  }

  if ('scopes' in authorizeResult) {
    const hasRequiredScopes = appAuthConfig.scopes.every(scope =>
      authorizeResult.scopes.includes(scope),
    );
    if (!hasRequiredScopes) {
      await logout();
      return false;
    }
  }

  fetchUserInfo().catch(async err => {
    await logout();
    await Navigation.dismissAllModals();
    await Navigation.dismissAllOverlays();
    await Navigation.setRoot({
      root: await getAppRoot(),
    });
  });

  return true;
}
