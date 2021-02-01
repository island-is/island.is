import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'
import { TokenService } from '../../../services/TokenService'

const providers = [
  Providers.IdentityServer4({
    id: process.env.IDENTITYSERVER_ID,
    name: process.env.IDENTITYSERVER_NAME,
    scope: process.env.IDENTITYSERVER_SCOPE,
    domain: process.env.IDENTITYSERVER_DOMAIN,
    clientId: process.env.IDENTITYSERVER_CLIENT_ID,
    clientSecret: process.env.IDENTITYSERVER_SECRET,
  }),
]

const callbacks = {}

callbacks.signIn = async function signIn(user, account, profile) {
  console.info('Calling next-auth signIn callback.')
  if (account.provider === 'identity-server') {
    user.nationalId = profile.nationalId
    user.accessToken = account.accessToken
    user.refreshToken = account.refreshToken
    user.idToken = profile.idToken
    return true
  }

  return false
}

callbacks.jwt = async function jwt(token, user) {
  console.info('Calling next-auth jwt callback.', token.refreshToken)
  if (user) {
    token = {
      nationalId: user.nationalId,
      name: user.name,
      accessToken: user.accessToken,
      refreshToken: user.refreshToken,
      idToken: user.idToken,
      isRefreshTokenExpired: false,
      updated: new Date(),
    }
  }

  console.info(
    'Seconds since last token update:',
    (new Date().getTime() - new Date(token.updated).getTime()) / 1000,
    token.refreshToken,
  )
  const decoded = parseJwt(token.accessToken)
  const expires = new Date(decoded.exp * 1000)
  const renewalTime = expires.setSeconds(expires.getSeconds() + 300)

  if (
    decoded?.exp &&
    new Date() > renewalTime &&
    !token.isRefreshTokenExpired
  ) {
    console.info('Old refresh token:', token.refreshToken)
    try {
      ;[
        token.accessToken,
        token.refreshToken,
      ] = await TokenService.refreshAccessToken(token.refreshToken)
      token.updated = new Date()
      console.info('New refresh token', token.refreshToken)
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
  console.info(
    'Calling next-auth session callback.',
    session.refreshToken,
    token.refreshToken,
  )
  session.accessToken = token.accessToken
  session.refreshToken = token.refreshToken // TODO: Remove from session
  session.idToken = token.idToken
  const decoded = parseJwt(session.accessToken)
  session.expires = new Date(decoded.exp * 1000)
  console.log(
    'session.expires',
    (session.expires.getTime() - new Date().getTime()) / 1000,
  )
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
