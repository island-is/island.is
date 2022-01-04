import { getStaticEnv } from "@island.is/shared/utils"

const isProd = process.env.NODE_ENV === 'production'

const devConfig = {
  production: false,
  NEXTAUTH_URL: process.env.NEXTAUTH_URL ?? 'http://localhost:4200',
  IDS: 'identity-server.dev01.devland.is',
  IDENTITY_SERVER_DOMAIN: process.env.IDS_DOMAIN ?? 'identity-server.dev01.devland.is',
  IDENTITY_SERVER_LOGOUT_URL: 'localhost:4200'
}

const prodConfig = {
  production: true,
  IDS: isProd ? getStaticEnv('SI_PUBLIC_IDENTITY_SERVER_ISSUER_URL') : '',
  IDENTITY_SERVER_DOMAIN: process.env.IDS_DOMAIN ?? 'identity-server.dev01.devland.is',
  IDENTITY_SERVER_LOGOUT_URL: 'www.loftbru.is'
}

export default isProd ? prodConfig : devConfig
