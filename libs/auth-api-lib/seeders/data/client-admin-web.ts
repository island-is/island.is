import { createClient } from './helpers'

export const up = createClient({
  clientId: '@admin.island.is/web',
  clientType: 'spa',
  displayName: 'Stjórnborð Ísland.is',
  description: 'Inniheldur mörg stjórnborð tengd Ísland.is',
  allowedScopes: ['openid', 'profile', '@island.is/user-profile:read'],
  redirectUris: {
    dev: [
      'http://localhost:4201/stjornbord/signin-oidc',
      'http://localhost:4201/stjornbord/silent/signin-oidc',
      'https://*.dev01.devland.is/stjornbord/signin-oidc',
      'https://*.dev01.devland.is/stjornbord/silent/signin-oidc',
    ],
    staging: [
      'https://beta.staging01.devland.is/stjornbord/signin-oidc',
      'https://beta.staging01.devland.is/stjornbord/silent/signin-oidc',
    ],
    prod: [
      'https://island.is/stjornbord/signin-oidc',
      'https://island.is/stjornbord/silent/signin-oidc',
    ],
  },
  postLogoutRedirectUri: {
    dev: 'https://beta.dev01.devland.is',
    staging: 'https://beta.staging01.devland.is',
    prod: 'https://island.is',
  },
})
