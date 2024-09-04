import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { BadRequestException, Inject, Injectable } from '@nestjs/common'
import { ConfigType } from '@nestjs/config'

import { BffConfig } from '../../bff.config'
import { ParResponse, TokenResponse } from './ids.types'

@Injectable()
export class IdsService {
  private readonly baseUrl

  constructor(
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,

    @Inject(BffConfig.KEY)
    private readonly config: ConfigType<typeof BffConfig>,
  ) {
    this.baseUrl = this.config.auth.issuer
  }

  /**
   * Reusable fetch fn to make POST requests
   */
  private async postRequest<T>(
    endpoint: string,
    body: Record<string, string>,
  ): Promise<T> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams(body).toString(),
      })

      if (!response.ok) {
        throw new BadRequestException(`HTTP error! Status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      this.logger.error(
        `Error making request to ${endpoint}:`,
        JSON.stringify(error),
      )

      throw new BadRequestException(`Failed to fetch from ${endpoint}`)
    }
  }

  /**
   * Fetches the PAR (Pushed Authorization Requests) from the Ids
   */
  public async getPar({
    sid,
    codeChallenge,
    loginHint,
  }: {
    sid: string
    codeChallenge: string
    loginHint?: string
  }) {
    return this.postRequest<ParResponse>('/connect/par', {
      client_id: this.config.auth.clientId,
      client_secret: this.config.auth.secret,
      redirect_uri: this.config.auth.callbacksRedirectUris.login,
      response_type: 'code',
      response_mode: 'query',
      scope: [
        'openid',
        'profile',
        // Allows us to get refresh tokens
        'offline_access',
        ...this.config.auth.scopes,
      ].join(' '),
      state: sid,
      code_challenge: codeChallenge,
      code_challenge_method: 'S256',
      ...(loginHint && { login_hint: loginHint }),
    })
  }

  // Fetches tokens using the authorization code and code verifier
  public async getTokens({
    code,
    codeVerifier,
  }: {
    code: string
    codeVerifier: string
  }) {
    return this.postRequest<TokenResponse>('/connect/token', {
      grant_type: 'authorization_code',
      code,
      client_secret: this.config.auth.secret,
      client_id: this.config.auth.clientId,
      redirect_uri: this.config.auth.callbacksRedirectUris.login,
      code_verifier: codeVerifier,
    })
  }

  // Uses the refresh token to get a new access token
  public async refreshToken(refreshToken: string) {
    return this.postRequest<TokenResponse>('/connect/token', {
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
      client_secret: this.config.auth.secret,
      client_id: this.config.auth.clientId,
    })
  }
}
