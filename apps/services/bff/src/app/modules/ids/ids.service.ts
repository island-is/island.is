import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { BadRequestException, Inject, Injectable } from '@nestjs/common'
import { ConfigType } from '@nestjs/config'

import { BffConfig } from '../../bff.config'
import { ParResponse, TokenResponse } from './ids.types'
import { CryptoService } from '../../services/crypto.service'

@Injectable()
export class IdsService {
  private readonly baseUrl

  constructor(
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,

    @Inject(BffConfig.KEY)
    private readonly config: ConfigType<typeof BffConfig>,

    private readonly cryptoService: CryptoService,
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

  public getLoginSearchParams({
    sid,
    codeChallenge,
    loginHint,
    prompt,
  }: {
    sid: string
    codeChallenge: string
    loginHint?: string
    prompt?: string
  }): {
    client_id: string
    redirect_uri: string
    response_type: string
    response_mode: string
    scope: string
    state: string
    code_challenge: string
    code_challenge_method: string
    login_hint?: string
    prompt?: string
  } {
    return {
      client_id: this.config.auth.clientId,
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
      ...(prompt && { prompt }),
    }
  }

  /**
   * Fetches the PAR (Pushed Authorization Requests) from the Ids
   */
  public async getPar(args: {
    sid: string
    codeChallenge: string
    loginHint?: string
    prompt?: string
  }) {
    return this.postRequest<ParResponse>('/connect/par', {
      client_secret: this.config.auth.secret,
      ...this.getLoginSearchParams(args),
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

  /**
   * Use the refresh token to get a new tokens
   */
  public async refreshToken(refreshToken: string) {
    const decryptedRefreshToken = this.cryptoService.decrypt(refreshToken)

    return this.postRequest<TokenResponse>('/connect/token', {
      grant_type: 'refresh_token',
      refresh_token: decryptedRefreshToken,
      client_secret: this.config.auth.secret,
      client_id: this.config.auth.clientId,
    })
  }
}
