const isProd = process.env.NODE_ENV === 'production'

const devConfig = {
  production: false,
  NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  identityServerId: 'identity-server',
  identityServerClientId: '@island.is/samradsgatt',
  identityServerDomain: process.env.IDENTITY_SERVER_ISSUER_DOMAIN,
  identityServerLogoutURL: 'https://beta.dev01.devland.is/samradsgatt',
  identityServerSecret: process.env.IDENTITY_SERVER_SECRET,
  identityServerScope:
    'openid profile offline_access @samradsgatt.island.is/samradsgatt',
  identityServerName: 'Samradsgatt',
  idsTokenCookieName: 'next-auth.session-token',
  csrfCookieName: 'next-auth.csrf-token',
  backendDownloadUrl: 'https://samradapi-test.devland.is/api/Documents/',
}

const prodConfig = {
  production: true,
  NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  identityServerId: 'identity-server',
  identityServerClientId: '@island.is/samradsgatt',
  identityServerLogoutURL: 'https://island.is/samradsgatt',
  identityServerDomain: process.env.IDENTITY_SERVER_ISSUER_DOMAIN,
  identityServerSecret: process.env.IDENTITY_SERVER_SECRET,
  identityServerScope:
    'openid profile offline_access @samradsgatt.island.is/samradsgatt',
  identityServerName: 'Samradsgatt',
  idsTokenCookieName: '__Secure-next-auth.session-token',
  csrfCookieName: '__Host-next-auth.csrf-token',
  backendDownloadUrl: 'https://samradapi.island.is/api/Documents/',
}

export default isProd ? prodConfig : devConfig
