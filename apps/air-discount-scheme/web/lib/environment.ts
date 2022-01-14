import { getStaticEnv } from '@island.is/shared/utils'

const isProd = process.env.NODE_ENV === 'production'
// TODO remove isLocalhost flag before release.
const isLocalhost = window?.location.origin.includes('localhost')

const devConfig = {
  production: false,
  NEXTAUTH_URL: isLocalhost ? 'http://localhost:4200' : process.env.NEXTAUTH_URL,
  IDS: process.env.IDENTITY_SERVER_ISSUER_URL ?? 'identity-server.dev01.devland.is',
  identityServerDomain:
    process.env.IDENTITY_SERVER_DOMAIN ?? 'identity-server.dev01.devland.is',
  identityServerLogoutURL: isLocalhost
    ? 'https://loftbru.dev01.devland.is'
    : getStaticEnv('NEXTAUTH_URL'),
  identityServerSecret: process.env.IDENTITY_SERVER_SECRET,
  idsCookieName: process.env.IDS_COOKIE_NAME ?? 'next-auth.session-token',
  loftbruHost: isLocalhost
    ? 'http://localhost:4200'
    : getStaticEnv('NEXTAUTH_URL'),
}

const prodConfig = {
  production: true,
  NEXTAUTH_URL: isProd ? getStaticEnv('NEXTAUTH_URL') : '',
  IDS: isProd ? getStaticEnv('SI_PUBLIC_IDENTITY_SERVER_ISSUER_URL') : '',
  identityServerDomain: isProd ? getStaticEnv('IDENTITY_SERVER_DOMAIN') : '',
  identityServerLogoutURL: isProd ? getStaticEnv('NEXTAUTH_URL') : '',
  identityServerSecret: process.env.IDENTITY_SERVER_SECRET,
  idsCookieName: isProd ? getStaticEnv('IDS_COOKIE_NAME') : '',
  loftbruHost: isProd ? getStaticEnv('NEXTAUTH_URL') : '',
}

export default isProd ? prodConfig : devConfig
