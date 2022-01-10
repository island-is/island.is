import { getStaticEnv } from "@island.is/shared/utils"

const isProd = process.env.NODE_ENV === 'production'
// TODO remove isLocalhost flag before release.
const isLocalhost = true//window.location.origin.includes('localhost')

const devConfig = {
  production: false,
  NEXTAUTH_URL: process.env.NEXTAUTH_URL ?? 'http://localhost:4200',
  IDS: 'identity-server.dev01.devland.is',
  IDENTITY_SERVER_DOMAIN: process.env.IDENTITY_SERVER_DOMAIN ?? 'identity-server.dev01.devland.is',
  IDENTITY_SERVER_LOGOUT_URL: 'localhost:4200',
  idsCookieName: process.env.IDS_COOKIE_NAME ?? 'next-auth.session-token',
  LOFTBRU_HOST: isLocalhost ? 'http://localhost:4200' : getStaticEnv('LOFTBRU_HOST'),
  LOFTBRU_PROTECTED: isLocalhost ? '/min-rettindi' : getStaticEnv('LOFTBRU_PROTECTED')
}

const prodConfig = {
  production: true,
  NEXTAUTH_URL: isProd ? getStaticEnv('NEXTAUTH_URL') : '',
  IDS: isProd ? getStaticEnv('SI_PUBLIC_IDENTITY_SERVER_ISSUER_URL') : '',
  IDENTITY_SERVER_DOMAIN: isProd ? getStaticEnv('IDENTITY_SERVER_DOMAIN') : '',
  IDENTITY_SERVER_LOGOUT_URL: 'www.loftbru.is',
  idsCookieName: isProd ? getStaticEnv('IDS_COOKIE_NAME') : '',
  LOFTBRU_HOST: isProd ? getStaticEnv('LOFTBRU_HOST') : '',
  LOFTBRU_PROTECTED: isProd ? getStaticEnv('LOFTBRU_PROTECTED') : '',
}

export default isProd ? prodConfig : devConfig
