import NextAuth, { CallbacksOptions } from 'next-auth'
import { NextApiRequest, NextApiResponse } from 'next'
import Providers from 'next-auth/providers'
import {
  AuthUser,
  signIn as handleSignIn,
  session as handleSession,
  jwt as handleJwt,
  AuthSession,
} from '@island.is/next-ids-auth'
import { JWT } from 'next-auth/jwt'
import env from '../../../lib/environment'

const providers = [
  Providers.IdentityServer4({
    id: env.identityServerId,
    name: env.identityServerName,
    scope: env.identityServerScope,
    clientSecret: env.identityServerClientId,
    clientId: env.identityServerClientId,
    domain: env.identityServerDomain,
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
  return handleSignIn(user, account, profile, env.identityServerClientId)
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
    env.identityServerClientId,
    env.identityServerSecret,
    env.NEXTAUTH_URL,
    env.identityServerDomain,
  )
}

async function session(session: AuthSession, user: AuthUser) {
  return handleSession(session, user)
}

const options = { providers, callbacks }

const handleAuth = (req: NextApiRequest, res: NextApiResponse) => {
  NextAuth(req as any, res, options)
}

export default handleAuth
