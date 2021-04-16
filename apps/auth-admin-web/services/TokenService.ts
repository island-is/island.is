/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios'
import { IdentityServer } from '../utils/ids.constants'

export class TokenService {
  static async refreshAccessToken(refreshToken: string): Promise<any | null> {
    const params = `client_id=${IdentityServer.clientId}&client_secret=${
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
}
