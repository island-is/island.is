const isProd = process.env.NODE_ENV === 'production'
// TODO remove isLocalhost flag before release.
const isLocalhost = false

const devConfig = {
  production: false,
  NEXTAUTH_URL: process.env.NEXTAUTH_URL ?? 'http://localhost:4200',
  identityServerDomain:
    process.env.IDENTITY_SERVER_DOMAIN ?? 'identity-server.dev01.devland.is',
  identityServerLogoutURL: isLocalhost
    ? 'http://localhost:4200'
    : process.env.NEXTAUTH_URL,
  identityServerSecret: process.env.IDENTITY_SERVER_SECRET,
  idsCookieName: process.env.IDS_COOKIE_NAME ?? 'next-auth.session-token',
}

const prodConfig = {
  production: true,
  NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  identityServerDomain: process.env.IDENTITY_SERVER_DOMAIN,
  identityServerLogoutURL: process.env.NEXTAUTH_URL,
  identityServerSecret: process.env.IDENTITY_SERVER_SECRET,
  idsCookieName: 'next-auth.session-token',
}

export default isProd ? prodConfig : devConfig
