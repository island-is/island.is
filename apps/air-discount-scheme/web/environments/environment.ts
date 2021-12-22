import { getStaticEnv } from "@island.is/shared/utils"

const isProd = process.env.NODE_ENV === 'production'

const devConfig = {
  production: false,
  NEXTAUTH_URL: process.env.NEXTAUTH_URL ?? 'http://localhost:4200',
  idsCookieName: process.env.IDS_COOKIE_NAME ?? 'next-auth.session-token',
  IDS: 'identity-server.dev01.devland.is',
}

const prodConfig = {
  production: true,
  IDS: isProd ? getStaticEnv('SI_PUBLIC_IDENTITY_SERVER_ISSUER_URL') : '',
}

export default isProd ? prodConfig : devConfig
