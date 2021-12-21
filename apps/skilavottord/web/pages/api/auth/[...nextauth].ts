import NextAuth, { CallbacksOptions } from 'next-auth'
import Providers from 'next-auth/providers'
import { JWT } from 'next-auth/jwt'
import { NextApiRequest, NextApiResponse } from 'next-auth/internals/utils'

import environment from '../../../environments/environment'

const { identityProvider } = environment

import {
  AuthUser,
  signIn as handleSignIn,
  jwt as handleJwt,
  session,
  AuthSession,
} from '@island.is/next-ids-auth'

const signIn = (
  user: AuthUser,
  account: Record<string, unknown>,
  profile: Record<string, unknown>,
): boolean => handleSignIn(user, account, profile, 'identity-server')

const jwt = async (token: JWT, user: AuthUser) => {
  if (user) {
    token = {
      nationalId: user.nationalId,
      name: user.name,
      accessToken: user.accessToken,
      refreshToken: user.refreshToken,
      idToken: user.idToken,
      isRefreshTokenExpired: false,
      folder: token.folder ?? uuid(),
      // TODO: service: RolesRule.OSK,
    }
  }
  return await handleJwt(
    token,
    'identity-server',
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
