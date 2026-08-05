import NextAuth from 'next-auth'
import type { NextAuthOptions } from 'next-auth'
import { NextApiRequest, NextApiResponse } from 'next'

import environment from '../../../environments/environment'

import {
  signIn as handleSignIn,
  jwt as handleJwt,
  session,
  AuthSession,
} from '@island.is/next-ids-auth'

const { identityProvider } = environment

const options: NextAuthOptions = {
  providers: [
    {
      id: 'identity-server',
      name: 'Skilavottord',
      type: 'oauth',
      wellKnown: `https://${identityProvider.domain}/.well-known/openid-configuration`,
      clientId: '@urvinnslusjodur.is/skilavottord',
      clientSecret: identityProvider.clientSecret,
      authorization: {
        params: {
          scope:
            'openid profile offline_access @urvinnslusjodur.is/skilavottord',
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
      return handleSignIn(account as Record<string, unknown>, 'identity-server')
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
        '@urvinnslusjodur.is/skilavottord',
        identityProvider.clientSecret,
        identityProvider.nextAuth,
        identityProvider.domain,
      )
    },
    async session({ session: sess, token }) {
      return session(sess as unknown as AuthSession, token)
    },
  },
}

export default (req: NextApiRequest, res: NextApiResponse) =>
  NextAuth(req, res, options)
