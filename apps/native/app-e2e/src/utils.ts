const scopes =
  'openid profile api_resource.scope offline_access @island.is/applications:read'

export const config = {
  identityServer: {
    clientId: '@island.is-app',
    issuer: 'https://identity-server.dev01.devland.is',
    scopes: scopes?.split(' '),
  },
  apiEndpoint: 'https://beta.dev01.devland.is/api',
  bundleId: 'is.island.app-dev',
  phoneNumber: '010-7789',
}
