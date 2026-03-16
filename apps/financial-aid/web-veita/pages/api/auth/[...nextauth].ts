import NextAuth from 'next-auth'
import type { NextAuthOptions } from 'next-auth'
import { NextApiRequest, NextApiResponse } from 'next'
import { identityServerConfig } from '@island.is/financial-aid/shared/lib'
import {
  signIn as handleSignIn,
  jwt as handleJwt,
  session as handleSession,
  AuthSession,
} from '@island.is/next-ids-auth'
import { MunicipalitiesFinancialAidScope } from '@island.is/auth/scopes'

const identityServerSecret = process.env.IDENTITY_SERVER_SECRET

if (!identityServerSecret) {
  throw new Error('IDENTITY_SERVER_SECRET is required')
}

const options: NextAuthOptions = {
  providers: [
    {
      id: identityServerConfig.id,
      name: identityServerConfig.name,
      type: 'oauth',
      wellKnown: `https://${process.env.IDENTITY_SERVER_DOMAIN}/.well-known/openid-configuration`,
      clientId: identityServerConfig.clientId,
      clientSecret: identityServerSecret,
      authorization: {
        params: {
          scope: `${identityServerConfig.scope} ${MunicipalitiesFinancialAidScope.employee}`,
        },
      },
      checks: ['pkce', 'state'],
      idToken: true,
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          nationalId: profile.nationalId,
        }
      },
    },
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: 'jwt' },
  callbacks: {
    async signIn({ account }) {
      return handleSignIn(
        account as Record<string, unknown>,
        identityServerConfig.id,
      )
    },
    async jwt({ token, user, account, profile }) {
      if (account && user) {
        token = {
          ...token,
          nationalId: (profile as any)?.nationalId,
          name: user.name,
          accessToken: account.access_token as string,
          refreshToken: account.refresh_token as string,
          idToken: account.id_token as string,
          isRefreshTokenExpired: false,
        }
      }
      return await handleJwt(
        token,
        identityServerConfig.clientId,
        identityServerSecret,
        process.env.NEXTAUTH_URL,
        process.env.IDENTITY_SERVER_DOMAIN,
      )
    },
    async session({ session, token }) {
      return handleSession(session as unknown as AuthSession, token)
    },
  },
}

export default (req: NextApiRequest, res: NextApiResponse) =>
  NextAuth(req, res, options)
