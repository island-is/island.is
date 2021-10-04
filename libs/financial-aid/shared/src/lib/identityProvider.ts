import { User } from 'next-auth'
import { GenericObject, SessionBase } from 'next-auth/_utils'
import { decodeToken } from './utils'
import axios from 'axios'

export const IDENTITY_SERVER_SESSION_TOKEN_COOKIE_NAME =
  'next-auth.session-token'

export const identityServerId = 'identity-server'

export const signOutUrl = (window: Window, idToken: string) =>
  `${window.location.origin}/api/auth/logout?id_token=${idToken}`

export type AuthUser = User & {
  nationalId: string
  accessToken: string
  refreshToken: string
  idToken: string
}

export type AuthSession = SessionBase & {
  idToken: string
  scope: string[]
}

export const identityServerConfig = {
  id: identityServerId,
  name: 'Iceland authentication service',
  scope: 'openid profile',
  clientId: '@samband_islenskra_sveitarfelaga/fjarhagur',
}

export const handleSignIn = (
  user: AuthUser,
  account: GenericObject,
  profile: GenericObject,
) => {
  if (account.provider === identityServerConfig.id) {
    user.nationalId = profile.nationalId
    user.accessToken = account.accessToken
    user.refreshToken = account.refreshToken
    user.idToken = account.idToken
    return true
  }

  return false
}

export const checkExpiry = (
  accessToken: string,
  isRefreshTokenExpired: boolean,
) => {
  const decoded = decodeToken(accessToken)
  const expires = new Date(decoded.exp * 1000)
  const renewalTime = new Date(expires.setSeconds(expires.getSeconds() - 300))
  return decoded?.exp && new Date() > renewalTime && !isRefreshTokenExpired
}

export const refreshAccessToken = async (
  refreshToken: string,
  secret?: string,
  nextAuthUrl?: string,
  domain?: string,
) => {
  const params = `client_id=${
    identityServerConfig.clientId
  }&client_secret=${secret}&grant_type=refresh_token&redirect_uri=${encodeURIComponent(
    `${nextAuthUrl}/callback/identity-server`,
  )}&refresh_token=${refreshToken}`

  const response = await axios.post(`https://${domain}/connect/token`, params, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  })

  return [response.data.access_token, response.data.refresh_token]
}

export const getSession = (session: AuthSession, user: AuthUser) => {
  session.accessToken = user.accessToken
  session.idToken = user.idToken
  const decoded = decodeToken(session.accessToken)
  session.expires = JSON.stringify(new Date(decoded.exp * 1000))
  session.scope = decoded.scope
  return session
}
