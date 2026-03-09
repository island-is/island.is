import NextAuth from 'next-auth'
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

export default async (req: NextApiRequest, res: NextApiResponse) => {
  let idTokenToStore: string | undefined

  const callbacks = {
    signIn(
      user: AuthUser,
      account: Record<string, unknown>,
      profile: Record<string, unknown>,
    ): Promise<boolean> {
      return handleSignIn(user, account, profile, identityServerConfig.id)
    },

    async jwt(token: JWT, user: AuthUser) {
      if (user) {
        idTokenToStore = user.idToken
        token = {
          nationalId: user.nationalId,
          name: user.name,
          accessToken: user.accessToken,
          refreshToken: user.refreshToken,
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
    },

    async session(session: AuthSession, user: AuthUser) {
      return handleSession(session, user)
    },
  }

  const originalSetHeader = res.setHeader.bind(res)
  res.setHeader = (name: string, value: any) => {
    if (name.toLowerCase() === 'set-cookie' && idTokenToStore) {
      const cookies = Array.isArray(value) ? value : [value]
      const secure = env.NEXTAUTH_URL?.startsWith('https') ? '; Secure' : ''
      cookies.push(
        `samradsgatt-id-token=${idTokenToStore}; Path=/samradsgatt; HttpOnly; SameSite=Lax${secure}`,
      )
      idTokenToStore = undefined
      return originalSetHeader(name, cookies)
    }
    return originalSetHeader(name, value)
  }

  return NextAuth(req, res, { providers, callbacks })
}
