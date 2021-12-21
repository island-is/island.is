// import NextAuth from 'next-auth'
// import Providers from 'next-auth/providers'
// import { uuid } from 'uuidv4'
// import { identityServerConfig } from '@island.is/air-discount-scheme-web/lib'
// import {
//   AuthUser,
//   signIn as handleSignIn,
//   jwt as handleJwt,
//   session as handleSession,
//   AuthSession,
// } from '@island.is/next-ids-auth'
// import { JWT } from 'next-auth/jwt'


import NextAuth, { CallbacksOptions } from 'next-auth'
import Providers from 'next-auth/providers'
import { uuid } from 'uuidv4'
import {
  identityServerConfig,
  RolesRule,
} from '@island.is/financial-aid/shared/lib'
import {
  AuthUser,
  signIn as handleSignIn,
  jwt as handleJwt,
  session as handleSession,
  AuthSession,
} from '@island.is/next-ids-auth'
import { NextApiRequest, NextApiResponse } from 'next-auth/internals/utils'
import { JWT } from 'next-auth/jwt'

const providers = [
  Providers.IdentityServer4({
    id: identityServerConfig.id,
    name: 'Iceland authentication service',
    scope: 'openid profile @vegagerdin.is/air-discount-scheme-scope @vegagerdin.is/air-discount-scheme-scope:admin offline_access @skra.is/individuals',
    clientId: '@vegagerdin.is/air-discount-scheme',
    domain: 'identity-server.dev01.devland.is',
    clientSecret: process.env.IDENTITY_SERVER_SECRET,
    protection: 'pkce',
  })
]

const callbacks: CallbacksOptions = {
  signIn: signIn,
  jwt: jwt,
  session: session,
}

async function signIn(
  user: AuthUser,
  account: Record<string, unknown>,
  profile: Record<string, unknown>,
): Promise<boolean> {
  return handleSignIn(user, account, profile, identityServerConfig.id)
}

async function jwt(token: JWT, user: AuthUser) {
  if (user) {
    token = {
      nationalId: user.nationalId,
      name: user.name,
      accessToken: user.accessToken,
      refreshToken: user.refreshToken,
      idToken: user.idToken,
      isRefreshTokenExpired: false,
      folder: token.folder ?? uuid(),
      service: RolesRule.OSK,
    }
  }
  return await handleJwt(
    token,
    identityServerConfig.clientId,
    process.env.IDENTITY_SERVER_SECRET,
    process.env.NEXTAUTH_URL,
    process.env.IDENTITY_SERVER_DOMAIN,
  )
}

async function session(session: AuthSession, user: AuthUser) {
  return handleSession(session, user)
}

const options = { providers, callbacks }

export default (req: NextApiRequest, res: NextApiResponse) =>
  NextAuth(req, res, options)


// export default async (req, res) => await NextAuth({
//   // https://next-auth.js.org/configuration/providers
//   providers: [
//     Providers.Google({
//       clientId: process.env.GOOGLE_CLID,
//       clientSecret: process.env.GOOGLE_CLSEC
//     }), 
//     Providers.IdentityServer4({
//       id: identityServerConfig.id,
//       name: 'Iceland authentication service',
//       scope: 'openid profile @vegagerdin.is/air-discount-scheme-scope @vegagerdin.is/air-discount-scheme-scope:admin offline_access @skra.is/individuals',
//       clientId: '@vegagerdin.is/air-discount-scheme',
//       domain: 'identity-server.dev01.devland.is',
//       clientSecret: process.env.IDENTITY_SERVER_SECRET,
//       protection: 'pkce',
//     })
//   ],
//   callbacks: {
//     async signIn(
//       user: AuthUser,
//       account: Record<string, unknown>,
//       profile: Record<string, unknown>,
//     ): Promise<boolean> {
//       console.log('pre sign in')
//       return handleSignIn(user, account, profile, identityServerConfig.id)
//     },

//     // async jwt(token: JWT, user: AuthUser) {
//     //   console.log('my token: ' + token)
//     //   if (user) {
//     //     token = {
//     //       nationalId: user.nationalId,
//     //       name: user.name,
//     //       accessToken: user.accessToken,
//     //       refreshToken: user.refreshToken,
//     //       idToken: user.idToken,
//     //       isRefreshTokenExpired: false,
//     //       folder: token.folder ?? uuid(),
//     //       service: 'Loftbru',
//     //     }
//     //   }
//     //   return await handleJwt(
//     //     token,
//     //     'identity-server',
//     //     process.env.IDENTITY_SERVER_SECRET,
//     //     process.env.NEXTAUTH_URL ?? 'http://localhost:4200',
//     //     process.env.IDENTITY_SERVER_DOMAIN ?? 'https://identity-server.dev01.devland.is',
//     //   )
//     // },

//     async session(session: AuthSession, user: AuthUser) {
//       console.log('[nextauth] session ' + session)
//       console.log(session)
//       return handleSession(session, user)
//     }
//   },
//   events: {},
//   debug: true
// })