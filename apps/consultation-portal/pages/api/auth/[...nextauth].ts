import NextAuth, { CallbacksOptions } from 'next-auth'
import { NextApiRequest, NextApiResponse } from 'next'
import Providers from 'next-auth/providers'
import { identityServerConfig } from '../../../lib/idsConfig'
import env from '../../../lib/environment'

import {
  AuthUser,
  signIn as handleSignIn,
  session as handleSession,
  jwt as handleJwt,
  AuthSession,
} from '@island.is/next-ids-auth'
import { JWT } from 'next-auth/jwt'

const providers = [
  Providers.IdentityServer4({
    id: identityServerConfig.id,
    name: identityServerConfig.name,
    scope: identityServerConfig.scope,
    clientSecret: env.identityServerSecret,
    clientId: identityServerConfig.clientId,
    domain: identityServerConfig.domain,
    protection: 'pkce',
  }),
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
    }
  }
  return await handleJwt(
    token,
    identityServerConfig.clientId,
    env.identityServerSecret,
    env.NEXTAUTH_URL,
    env.identityServerDomain,
  )
}

async function session(session: AuthSession, user: AuthUser) {
  return handleSession(session, user)
}

const options = { providers, callbacks }

export default (req: NextApiRequest, res: NextApiResponse) =>
  NextAuth(req, res, options)
