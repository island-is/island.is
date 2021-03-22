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
  env: typeof env;
}

export const config: Config = {
  identityServer: {
    issuer: env.IDENTITYSERVER_ISSUER || 'https://identity-server.dev01.devland.is',
    clientId: env.IDENTITYSERVER_CLIENT_ID || '@island.is-app',
    scopes: env.IDENTITYSERVER_SCOPES?.split(' ') || ['openid', 'profile', 'api_resource.scope', 'offline_access'],
  },
  apiEndpoint: env.API_ENDPOINT || 'https://beta.dev01.devland.is/api',
  bundleId: env.BUNDLE_ID || 'is.island.app-dev',
  storybookMode: false,
  env,
};
