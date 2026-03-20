import { identityServerConfig } from '@island.is/air-discount-scheme-web/lib'
import env from '@island.is/air-discount-scheme-web/lib/environment'
import { Role } from '@island.is/air-discount-scheme/types'
import {
  AuthSession,
  jwt as handleJwt,
  session as handleSession,
  signIn as handleSignIn,
} from '@island.is/next-ids-auth'
import { NextApiRequest, NextApiResponse } from 'next'
import type { NextAuthOptions } from 'next-auth'
import NextAuth from 'next-auth'
import { uuid } from 'uuidv4'

const options: NextAuthOptions = {
  providers: [
    {
      id: identityServerConfig.id,
      name: identityServerConfig.name,
      type: 'oauth',
      wellKnown: `https://${env.identityServerDomain}/.well-known/openid-configuration`,
      clientId: identityServerConfig.clientId,
      clientSecret: env.identityServerSecret,
      authorization: {
        params: { scope: identityServerConfig.scope },
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
          nationalId: (profile as unknown as { nationalId: string })
            ?.nationalId,
          name: user.name,
          accessToken: account.access_token as string,
          refreshToken: account.refresh_token as string,
          idToken: account.id_token as string,
          isRefreshTokenExpired: false,
          folder: token.folder ?? uuid(),
          role: Role.USER,
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
    async session({ session, token }) {
      return handleSession(session as unknown as AuthSession, token)
    },
  },
}

export default (req: NextApiRequest, res: NextApiResponse) =>
  NextAuth(req, res, options)
