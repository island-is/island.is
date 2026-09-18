import { decode } from 'jsonwebtoken'
import axios from 'axios'

// Sessions are polled every 120 seconds, so the renewal window has to be wide
// enough that a poll always lands inside it while the token is still valid.
// Capped at half the token lifetime so short-lived tokens don't renew on every
// request.
const renewalSeconds = 300

export const checkExpiry = (
  accessToken: string,
  isRefreshTokenExpired: boolean,
) => {
  const decoded = decode(accessToken)

  if (decoded && !(typeof decoded === 'string') && decoded['exp']) {
    const lifetime = decoded.iat ? decoded.exp - decoded.iat : undefined
    const renewalWindow = lifetime
      ? Math.min(renewalSeconds, Math.floor(lifetime / 2))
      : renewalSeconds
    const expires = new Date(decoded.exp * 1000)
    const renewalTime = new Date(expires.getTime() - renewalWindow * 1000)
    return decoded.exp && new Date() > renewalTime && !isRefreshTokenExpired
  }

  return false
}

export const refreshAccessToken = async (
  refreshToken: string,
  clientId: string,
  secret?: string,
  nextAuthUrl?: string,
  domain?: string,
) => {
  const params = `client_id=${clientId}&client_secret=${secret}&grant_type=refresh_token&redirect_uri=${encodeURIComponent(
    `${nextAuthUrl}/callback/identity-server`,
  )}&refresh_token=${refreshToken}`

  const response = await axios.post(`https://${domain}/connect/token`, params, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  })

  return [response.data.access_token, response.data.refresh_token]
}
