import { Platform } from 'react-native';
import { Constants } from 'react-native-unimodules';
import env from 'react-native-ultimate-config';

export interface Config {
  identityServer: {
    issuer: string;
    clientId: string;
    scopes: string[];
  };
  apiEndpoint: string;
  bundleId: string;
  storybookMode: boolean;
  disableLockScreen: boolean;
  env: typeof env;
  constants: typeof Constants,
}

export const config: Config = {
  identityServer: {
    issuer: env.IDENTITYSERVER_ISSUER || 'https://identity-server.dev01.devland.is',
    clientId: env.IDENTITYSERVER_CLIENT_ID || '@island.is-app',
    scopes: env.IDENTITYSERVER_SCOPES?.split(' ') || ['openid', 'profile', 'api_resource.scope', 'offline_access'],
  },
  apiEndpoint: 'https://beta.dev01.devland.is/api',
  bundleId: Platform.select({
    ios: env.BUNDLE_ID_IOS,
    android: env.BUNDLE_ID_ANDROID,
  }) || 'is.island.app',
  storybookMode: false,
  disableLockScreen: false,
  constants: Constants,
  env,
};

console.log({ config });
