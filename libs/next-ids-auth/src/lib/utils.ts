import { decode } from 'jsonwebtoken'
import axios from 'axios'

const renewalSeconds = 10

export const checkExpiry = (
  accessToken: string,
  isRefreshTokenExpired: boolean,
) => {
  const decoded = decode(accessToken)

  if (decoded && !(typeof decoded === 'string') && decoded['exp']) {
    const expires = new Date(decoded.exp * 1000)
    // Set renewalTime few seconds before the actual time to make sure we
    // don't indicate a valid token that could expire before it is used.
    const renewalTime = new Date(expires.getTime() - renewalSeconds * 1000)
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
