import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'
import { IdentityServer } from '../../../utils/ids.constants'
import { TokenService } from '../../../services/TokenService'

const providers = [
  Providers.IdentityServer4({
    id: IdentityServer.id,
    name: IdentityServer.name,
    scope: IdentityServer.scope,
    clientId: IdentityServer.clientId,
    domain: process.env.IDENTITYSERVER_DOMAIN,
    clientSecret: process.env.IDENTITYSERVER_SECRET,
    protection: 'pkce',
  }),
]

const callbacks = {}

callbacks.signIn = async function signIn(user, account, profile) {
  if (account.provider === 'identity-server') {
    user.nationalId = profile.nationalId
    user.accessToken = account.accessToken
    user.refreshToken = account.refreshToken
    user.idToken = account.idToken
    return true
  }

  return false
}

callbacks.jwt = async function jwt(token, user) {
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

  const decoded = parseJwt(token.accessToken)
  const expires = new Date(decoded.exp * 1000)
  const renewalTime = expires.setSeconds(expires.getSeconds() - 300)

  if (
    decoded?.exp &&
    new Date() > renewalTime &&
    !token.isRefreshTokenExpired
  ) {
    try {
      ;[token.accessToken, token.refreshToken] =
        await TokenService.refreshAccessToken(token.refreshToken)
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

callbacks.session = async function session(session, token) {
  session.accessToken = token.accessToken
  session.idToken = token.idToken
  const decoded = parseJwt(session.accessToken)
  session.expires = new Date(decoded.exp * 1000)
  session.scope = decoded.scope
  return session
}

function parseJwt(token) {
  let base64Url = token.split('.')[1]
  let base64 = base64Url.replace('-', '+').replace('_', '/')
  let decodedData = JSON.parse(Buffer.from(base64, 'base64').toString('binary'))

  return decodedData
}

const options = { providers, callbacks }

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default (req, res) => NextAuth(req, res, options)
