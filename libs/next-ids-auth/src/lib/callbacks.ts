import { decode } from 'jsonwebtoken'

import { AuthSession, AuthUser } from './types'
import { checkExpiry, refreshAccessToken } from './utils'

export const signIn = (
  user: AuthUser,
  account: Record<string, unknown>,
  profile: Record<string, unknown>,
  identityServerId: string,
) => {
  if (account.provider === identityServerId) {
    user.nationalId = profile.nationalId as string
    user.accessToken = account.accessToken as string
    user.refreshToken = account.refreshToken as string
    user.idToken = account.idToken as string
    return true
  }

  return false
}

export const jwt = async (
  token: Record<string, unknown>,
  clientId: string,
  idsSecret?: string,
  nextUrl?: string,
  idsServerDomain?: string,
) => {
  if (
    checkExpiry(
      token.accessToken as string,
      token.isRefreshTokenExpired as boolean,
    )
  ) {
    try {
      const [accessToken, refreshToken] = await refreshAccessToken(
        token.refreshToken as string,
        clientId,
        idsSecret,
        nextUrl,
        idsServerDomain,
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

export const session = (session: AuthSession, user: AuthUser) => {
  session.accessToken = user.accessToken
  session.idToken = user.idToken
  const decoded = decode(session.accessToken)

  if (
    decoded &&
    !(typeof decoded === 'string') &&
    decoded['exp'] &&
    decoded['scope']
  ) {
    session.expires = JSON.stringify(new Date(decoded.exp * 1000))
    session.scope = decoded.scope
  }

  return session
}
