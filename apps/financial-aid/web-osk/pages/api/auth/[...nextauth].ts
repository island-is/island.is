import NextAuth, { Callbacks, User } from 'next-auth'
import Providers from 'next-auth/providers'
import axios from 'axios'
import {
  GenericObject,
  NextApiRequest,
  NextApiResponse,
  SessionBase,
} from 'next-auth/_utils'
import { uuid } from 'uuidv4'
import {
  decodeToken,
  identityServerId,
  ReturnUrl,
  RolesRule,
} from '@island.is/financial-aid/shared/lib'

type AuthUser = User & {
  nationalId: string
  accessToken: string
  refreshToken: string
  idToken: string
}

type AuthSession = SessionBase & {
  idToken: string
  scope: string[]
}

const identityServer = {
  id: identityServerId,
  name: 'Iceland authentication service',
  scope: 'openid profile',
  clientId: '@samband_islenskra_sveitarfelaga/fjarhagur',
}

const providers = [
  Providers.IdentityServer4({
    id: identityServer.id,
    name: identityServer.name,
    scope: identityServer.scope,
    clientId: identityServer.clientId,
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
  if (account.provider === identityServer.id) {
    user.nationalId = profile.nationalId
    user.accessToken = account.accessToken
    user.refreshToken = account.refreshToken
    user.idToken = account.idToken
    return true
  }

  return false
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
      returnUrl: ReturnUrl.APPLICATION,
    }
  }

  const decoded = decodeToken(token.accessToken)
  const expires = new Date(decoded.exp * 1000)
  const renewalTime = new Date(expires.setSeconds(expires.getSeconds() - 300))

  if (
    decoded?.exp &&
    new Date() > renewalTime &&
    !token.isRefreshTokenExpired
  ) {
    try {
      const [accessToken, refreshToken] = await refreshAccessToken(
        token.refreshToken,
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

async function refreshAccessToken(refreshToken: string) {
  const params = `client_id=${identityServer.clientId}&client_secret=${
    process.env.IDENTITYSERVER_SECRET
  }&grant_type=refresh_token&redirect_uri=${encodeURIComponent(
    `${process.env.NEXTAUTH_URL}/callback/identity-server`,
  )}&refresh_token=${refreshToken}`

  const response = await axios.post(
    `https://${process.env.IDENTITYSERVER_DOMAIN}/connect/token`,
    params,
    { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
  )

  return [response.data.access_token, response.data.refresh_token]
}

async function session(session: AuthSession, user: AuthUser) {
  session.accessToken = user.accessToken
  session.idToken = user.idToken
  const decoded = decodeToken(session.accessToken)
  session.expires = JSON.stringify(new Date(decoded.exp * 1000))
  session.scope = decoded.scope
  return session
}

const options = { providers, callbacks }

export default (req: NextApiRequest, res: NextApiResponse) =>
  NextAuth(req, res, options)
