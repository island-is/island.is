import NextAuth, { CallbacksOptions } from 'next-auth'
import Providers from 'next-auth/providers'
import { JWT } from 'next-auth/jwt'
import { NextApiRequest, NextApiResponse } from 'next-auth/internals/utils'

import environment from '../../../environments/environment'

import {
  AuthUser,
  signIn as handleSignIn,
  jwt as handleJwt,
  session,
  AuthSession,
} from '@island.is/next-ids-auth'

const { identityProvider } = environment

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
    }
  }
  return await handleJwt(
    token,
    '@urvinnslusjodur.is/skilavottord',
    identityProvider.clientSecret,
    identityProvider.nextAuth,
    identityProvider.domain,
  )
}

const options = {
  providers: [
    Providers.IdentityServer4({
      id: 'identity-server',
      name: 'Skilavottord',
      scope: 'openid profile offline_access @urvinnslusjodur.is/skilavottord',
      clientId: '@urvinnslusjodur.is/skilavottord',
      domain: identityProvider.domain,
      clientSecret: identityProvider.clientSecret,
      protection: 'pkce',
    }),
  ],
  callbacks: {
    signIn,
    jwt,
    session,
  },
}

export default (req: NextApiRequest, res: NextApiResponse) =>
  NextAuth(req, res, options)
