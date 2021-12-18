import NextAuth, { CallbacksOptions } from 'next-auth'
import Providers from 'next-auth/providers'
import {
  AuthUser,
  signIn as handleSignIn,
  jwt as handleJwt,
  session as handleSession,
  AuthSession,
} from '@island.is/next-ids-auth'
import { NextApiRequest, NextApiResponse } from 'next-auth/internals/utils'
import { JWT } from 'next-auth/jwt'
import { IdentityServer } from '../../../utils/ids.constants'

// const providers = [
//   Providers.IdentityServer4({
//     id: identityServerConfig.id,
//     name: identityServerConfig.name,
//     scope: identityServerConfig.scope,
//     clientId: identityServerConfig.clientId,
//     domain: process.env.IDENTITY_SERVER_DOMAIN ?? '',
//     clientSecret: process.env.IDENTITY_SERVER_SECRET ?? '',
//     protection: 'pkce',
//   }),
// ]

const idsProvider = Providers.IdentityServer4({
  id: IdentityServer.id,
  name: IdentityServer.name,
  scope: IdentityServer.scope,
  clientId: IdentityServer.clientId,
  domain: process.env.IDENTITYSERVER_DOMAIN,
  clientSecret: process.env.IDENTITYSERVER_SECRET,
  protection: 'pkce',
})

const providers = [idsProvider]

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
  return handleSignIn(user, account, profile, idsProvider.id)
}

async function jwt(token: JWT, user: AuthUser) {
  console.log('jwt')
  if (user) {
    token = {
      nationalId: user.nationalId,
      name: user.name,
      accessToken: user.accessToken,
      refreshToken: user.refreshToken,
      idToken: user.idToken,
      isRefreshTokenExpired: false,
    }
  }
  return await handleJwt(
    token,
    idsProvider.clientId,
    idsProvider.clientSecret as string,
    process.env.NEXTAUTH_URL,
    idsProvider.domain,
  )
}

async function session(session: AuthSession, user: AuthUser) {
  return handleSession(session, user)
}

const options = { providers, callbacks }

export default (req: NextApiRequest, res: NextApiResponse) =>
  NextAuth(req, res, options)
