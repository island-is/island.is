const isProd = process.env.NODE_ENV === 'production'

const devConfig = {
  production: false,
  NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  identityServerId: 'identity-server',
  identityServerClientId: '@island.is/samradsgatt',
  identityServerDomain: process.env.IDENTITY_SERVER_ISSUER_DOMAIN,
  identityServerLogoutURL: process.env.IDENTITY_SERVER_LOGOUT_URL,
  identityServerSecret: process.env.IDENTITY_SERVER_SECRET,
  identityServerScope: 'openid profile offline_access @island.is/samradsgatt',
  identityServerName: 'Samradsgatt',
  idsTokenCookieName: 'next-auth.session-token',
  csrfCookieName: 'next-auth.csrf-token',
}

const prodConfig = {
  production: true,
  NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  identityServerId: 'identity-server',
  identityServerClientId: '@island.is/samradsgatt',
  identityServerLogoutURL: process.env.IDENTITY_SERVER_LOGOUT_URL,
  identityServerDomain: process.env.IDENTITY_SERVER_ISSUER_DOMAIN,
  identityServerSecret: process.env.IDENTITY_SERVER_SECRET,
  identityServerScope: 'openid profile offline_access @island.is/samradsgatt',
  identityServerName: 'Samradsgatt',
  idsTokenCookieName: '__Secure-next-auth.session-token',
  csrfCookieName: '__Host-next-auth.csrf-token',
}

export default isProd ? prodConfig : devConfig
