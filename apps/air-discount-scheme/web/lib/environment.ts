const isProd = process.env.NODE_ENV === 'production'

const devConfig = {
  production: false,
  NEXTAUTH_URL: 'http://localhost:4200',
  identityServerDomain: 'innskra.dev01.devland.is',
  identityServerLogoutURL: 'http://localhost:4200',
  identityServerSecret: process.env.IDENTITY_SERVER_SECRET,
  idsTokenCookieName: 'next-auth.session-token',
  csrfCookieName: 'next-auth.csrf-token',
}

const prodConfig = {
  production: true,
  NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  identityServerLogoutURL: process.env.NEXTAUTH_URL,
  identityServerDomain: process.env.IDENTITY_SERVER_ISSUER_DOMAIN,
  identityServerSecret: process.env.IDENTITY_SERVER_SECRET,
  idsTokenCookieName: '__Secure-next-auth.session-token',
  csrfCookieName: '__Host-next-auth.csrf-token',
}

export default isProd ? prodConfig : devConfig
