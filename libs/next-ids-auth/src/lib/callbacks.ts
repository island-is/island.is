import { decode } from 'jsonwebtoken'

import { AuthSession } from './types'
import { checkExpiry, refreshAccessToken } from './utils'

export const signIn = (
  account: Record<string, unknown>,
  identityServerId: string,
) => {
  return account.provider === identityServerId
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

export const session = (
  session: AuthSession,
  token: Record<string, unknown>,
) => {
  if (typeof token.accessToken !== 'string' || typeof token.idToken !== 'string') {
    return {
      ...session,
      accessToken: '',
      idToken: '',
      scope: session.scope ?? [],
    }
  }

  session.accessToken = token.accessToken
  session.idToken = token.idToken
  session.scope = session.scope ?? []
  const decoded = decode(token.accessToken)

  if (
    decoded &&
    !(typeof decoded === 'string') &&
    decoded['exp'] &&
    decoded['scope']
  ) {
    session.expires = new Date(decoded.exp * 1000).toISOString()
    session.scope = Array.isArray(decoded.scope)
      ? decoded.scope
      : typeof decoded.scope === 'string'
        ? decoded.scope.split(' ')
        : []
  }

  return session
}
