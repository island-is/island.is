import NextAuth, { Callbacks } from 'next-auth'
import Providers from 'next-auth/providers'
import {
  GenericObject,
  NextApiRequest,
  NextApiResponse,
} from 'next-auth/_utils'
import { uuid } from 'uuidv4'
import {
  AuthSession,
  AuthUser,
  checkExpiry,
  decodeToken,
  getSession,
  handleSignIn,
  identityServerConfig,
  refreshAccessToken,
  RolesRule,
} from '@island.is/financial-aid/shared/lib'

const providers = [
  Providers.IdentityServer4({
    id: identityServerConfig.id,
    name: identityServerConfig.name,
    scope: identityServerConfig.scope,
    clientId: identityServerConfig.clientId,
    domain: process.env.IDENTITYSERVER_DOMAIN ?? '',
    clientSecret: process.env.IDENTITYSERVER_SECRET ?? '',
  }),
]

const callbacks: Callbacks = {
  signIn: signIn,
  jwt: jwt,
  session: session,
}

async function signIn(
  user: AuthUser,
  account: GenericObject,
  profile: GenericObject,
): Promise<boolean> {
  return handleSignIn(user, account, profile)
}

async function jwt(token: GenericObject, user: AuthUser) {
  if (user) {
    token = {
      nationalId: user.nationalId,
      name: user.name,
      accessToken: user.accessToken,
      refreshToken: user.refreshToken,
      idToken: user.idToken,
      isRefreshTokenExpired: false,
      folder: token.folder ?? uuid(),
      service: RolesRule.OSK,
    }
  }

  if (checkExpiry(token.accessToken, token.isRefreshTokenExpired)) {
    try {
      const [accessToken, refreshToken] = await refreshAccessToken(
        token.refreshToken,
        process.env.IDENTITYSERVER_SECRET,
        process.env.NEXTAUTH_URL,
        process.env.IDENTITYSERVER_DOMAIN,
      )
      token.accessToken = accessToken
      token.refreshToken = refreshToken
    } catch (error) {
      console.warn('Error refreshing access token.', error)
      // We don't know the refresh token lifetime, so we use the error response to check if it had expired
      const errorMessage = error?.response?.data?.error
      if (errorMessage && errorMessage === 'invalid_grant') {
        token.isRefreshTokenExpired = true
      }
    }
  }

  return token
}

async function session(session: AuthSession, user: AuthUser) {
  return getSession(session, user)
}

const options = { providers, callbacks }

export default (req: NextApiRequest, res: NextApiResponse) =>
  NextAuth(req, res, options)
