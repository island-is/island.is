const isProd = process.env.NODE_ENV === 'production'

const devConfig = {
  production: false,
  NEXTAUTH_URL: 'http://localhost:4200/api/auth/callback',
  identityServerId: 'identity-server',
  identityServerClientId: '@island.is/leyfisveitingagatt',
  identityServerDomain: '',
  identityServerLogoutUrl: '',
  identityServerSecret: '',
  identityServerScope: 'openid profile',
  identityServerName: 'Leyfisveitingagatt',
  idsTokenCookieName: 'next-auth.csrf-token',
  backendDownloadUrl: 'https://profun.island.is/umsoknarkerfi/api',
}

const prodConfig = {
  production: true,
  NEXTAUTH_URL: 'http://localhost:4200/api/auth/callback',
  identityServerId: 'identity-server',
  identityServerClientId: '@island.is/leyfisveitingagatt',
  identityServerDomain: '',
  identityServerLogoutUrl: '',
  identityServerSecret: '',
  identityServerScope: 'openid profile',
  identityServerName: 'Leyfisveitingagatt',
  idsTokenCookieName: 'next-auth.csrf-token',
  backendDownloadUrl: 'https://profun.island.is/umsoknarkerfi/api',
}

export default isProd ? prodConfig : devConfig
