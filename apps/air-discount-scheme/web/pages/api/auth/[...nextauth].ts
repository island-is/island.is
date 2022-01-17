import NextAuth, { CallbacksOptions } from 'next-auth'
import Providers from 'next-auth/providers'
import { uuid } from 'uuidv4'
import { identityServerConfig } from '@island.is/air-discount-scheme-web/lib'
import { Role } from '@island.is/air-discount-scheme/types'
import env from '@island.is/air-discount-scheme-web/lib/environment'
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
    name: identityServerConfig.name,
    scope: identityServerConfig.scope,
    clientId: identityServerConfig.clientId,
    domain: env.identityServerDomain,
    clientSecret: env.identityServerSecret,
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
      folder: token.folder ?? uuid(),
      role: user.role ?? Role.USER,
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
