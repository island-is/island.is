import { getStaticEnv } from "@island.is/shared/utils"

const isProd = process.env.NODE_ENV === 'production'
// TODO remove isLocalhost flag before release.
const isLocalhost = true//window.location.origin.includes('localhost')

const devConfig = {
  production: false,
  NEXTAUTH_URL: process.env.NEXTAUTH_URL ?? 'http://localhost:4200',
  IDS: 'identity-server.dev01.devland.is',
  identityServerDomain: process.env.IDENTITY_SERVER_DOMAIN ?? 'identity-server.dev01.devland.is',
  identityServerLogoutURL: isLocalhost ? 'https://loftbru.dev01.devland.is' : getStaticEnv('LOFTBRU_HOST'),
  identityServerSecret: process.env.IDENTITY_SERVER_SECRET,
  idsCookieName: process.env.IDS_COOKIE_NAME ?? 'next-auth.session-token',
  loftbruHost: isLocalhost ? 'http://localhost:4200' : getStaticEnv('LOFTBRU_HOST'),
  loftbruProtected: isLocalhost ? '/min-rettindi' : getStaticEnv('LOFTBRU_PROTECTED')
}

const prodConfig = {
  production: true,
  NEXTAUTH_URL: isProd ? getStaticEnv('NEXTAUTH_URL') : '',
  IDS: isProd ? getStaticEnv('SI_PUBLIC_IDENTITY_SERVER_ISSUER_URL') : '',
  identityServerDomain: isProd ? getStaticEnv('IDENTITY_SERVER_DOMAIN') : '',
  identityServerLogoutURL: isProd ? getStaticEnv('LOFTBRU_HOST') : '',
  identityServerSecret: process.env.IDENTITY_SERVER_SECRET,
  idsCookieName: isProd ? getStaticEnv('IDS_COOKIE_NAME') : '',
  loftbruHost: isProd ? getStaticEnv('LOFTBRU_HOST') : '',
  loftbruProtected: isProd ? getStaticEnv('LOFTBRU_PROTECTED') : '',
}

export default isProd ? prodConfig : devConfig
