const isProd = process.env.NODE_ENV === 'production'

const devConfig = {
  production: false,
  NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  identityServerId: 'identity-server',
  identityServerClientId: process.env.IDENTITYSERVER_CLIENT_ID,
  identityServerDomain: process.env.IDENTITY_SERVER_DOMAIN,
  identityServerLogoutURL: process.env.IDENTITY_SERVER_LOGOUT_URL,
  identityServerSecret: process.env.IDENTITYSERVER_SECRET,
  identityServerScope: process.env.IDENTITYSERVER_SCOPE,
  identityServerName: 'Samradsgatt',
  idsTokenCookieName: 'next-auth.session-token',
  csrfCookieName: 'next-auth.csrf-token',
}

const prodConfig = {
  production: true,
  NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  identityServerId: 'identity-server',
  identityServerClientId: process.env.IDENTITYSERVER_CLIENT_ID,
  identityServerLogoutURL: process.env.IDENTITY_SERVER_LOGOUT_URL,
  identityServerDomain: process.env.IDENTITY_SERVER_DOMAIN,
  identityServerSecret: process.env.IDENTITYSERVER_SECRET,
  identityServerScope: process.env.IDENTITYSERVER_SCOPE,
  identityServerName: 'Samradsgatt',
  idsTokenCookieName: '__Secure-next-auth.session-token',
  csrfCookieName: '__Host-next-auth.csrf-token',
}

export default isProd ? prodConfig : devConfig
