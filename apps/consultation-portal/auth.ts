import NextAuth from "next-auth";
import { AuthConfig } from '@auth/core/types'
import env from './lib/environment'
import { identityServerConfig } from './lib/idsConfig'
import {
  AuthSession,
  AuthUser,
  jwt as handleJwt,
  session as handleSession,
  signIn as handleSignIn,
} from '@island.is/next-ids-auth'
import IdentityServer6 from '@auth/core/providers/duende-identity-server6'



const authConfig= NextAuth({
  providers: [
    IdentityServer6({
      id: identityServerConfig.id,
      name: identityServerConfig.name,
      authorization: {
        url: identityServerConfig.domain,
        params: { scope: identityServerConfig.scope },
      },
      clientSecret: env.identityServerSecret,
      clientId: identityServerConfig.clientId,
      issuer: identityServerConfig.domain,
      checks: ['pkce'],
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  jwt: {},
  callbacks: {
    jwt: async ({ user, token }) => {
      console.log('jwt', user, token)
      if (user) {
        const typedUser = user as AuthUser

        token = {
          nationalId: typedUser.nationalId,
          name: typedUser.name,
          accessToken: typedUser.accessToken,
          refreshToken: typedUser.refreshToken,
          idToken: typedUser.idToken,
          isRefreshTokenExpired: false,
        }
      }
      const handledToken = await handleJwt(
        token,
        identityServerConfig.clientId,
        env.identityServerSecret,
        env.NEXTAUTH_URL,
        env.identityServerDomain,
      )

      return handledToken
    },
    session: async ({ session, user }) => {
      console.log('session', session, user)
      // TODO figure out a better way to handle this
      const typedUser = user as unknown as AuthUser
      const typedSession = session as unknown as AuthSession

      return handleSession(typedSession, typedUser)
    },
    signIn: ({ user, account, profile }) => {

      console.log('signIn', user, account, profile)
      const typedUser = user as AuthUser


      return handleSignIn(typedUser, account as unknown as any, profile as unknown as any, identityServerConfig.id)
    },
  },
}  satisfies AuthConfig)

export const { handlers, auth, signIn, signOut } = authConfig

export default authConfig
