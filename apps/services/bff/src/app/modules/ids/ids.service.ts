import { Inject, Injectable } from '@nestjs/common'
import { ConfigType } from '@nestjs/config'

import type { EnhancedFetchAPI } from '@island.is/clients/middlewares'
import { BffConfig } from '../../bff.config'
import { CryptoService } from '../../services/crypto.service'
import { ENHANCED_FETCH_PROVIDER_KEY } from '../enhancedFetch/enhanced-fetch.provider'
import {
  ApiResponse,
  ErrorRes,
  GetLoginSearchParamsReturnValue,
  ParResponse,
  TokenResponse,
} from './ids.types'

@Injectable()
export class IdsService {
  private readonly issuerUrl: string

  constructor(
    @Inject(BffConfig.KEY)
    private readonly config: ConfigType<typeof BffConfig>,

    @Inject(ENHANCED_FETCH_PROVIDER_KEY)
    private readonly enhancedFetch: EnhancedFetchAPI,

    private readonly cryptoService: CryptoService,
  ) {
    this.issuerUrl = this.config.ids.issuer
  }

  /**
   * Reusable fetch fn to make POST requests
   */
  private async postRequest<T>(
    endpoint: string,
    body: Record<string, string>,
  ): Promise<ApiResponse<T>> {
    try {
      const response = await this.enhancedFetch(
        `${this.issuerUrl}${endpoint}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams(body).toString(),
        },
      )

      const contentType = response.headers.get('content-type') || ''

      if (contentType.includes('application/json')) {
        const data = await response.json()

        if (!response.ok) {
          // If error response from Ids is not in the expected format, throw the data as is
          if (!data.error || !data.error_description) {
            throw data
          }

          return {
            type: 'error',
            data: {
              error: data.error,
              error_description: data.error_description,
            },
          } as ErrorRes
        }

        return {
          type: 'success',
          data: data as T,
        }
      }

      // Handle plain text responses
      const textResponse = await response.text()

      if (!response.ok) {
        throw textResponse
      }

      return {
        type: 'success',
        data: textResponse,
      } as ApiResponse<T>
    } catch (error) {
      throw new Error(error)
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
  }): GetLoginSearchParamsReturnValue {
    const { ids } = this.config
    return {
      client_id: ids.clientId,
      redirect_uri: this.config.callbacksRedirectUris.login,
      response_type: 'code',
      response_mode: 'query',
      scope: [
        'openid',
        'profile',
        // Allows us to get refresh tokens
        'offline_access',
        ...ids.scopes,
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
      client_secret: this.config.ids.secret,
      ...this.getLoginSearchParams(args),
    })
  }

  /**
   * Fetches the tokens from the Ids
   *
   * @param obj.code - The code from the Ids
   * @param obj.codeVerifier - The code verifier from the Ids
   */
  public async getTokens({
    code,
    codeVerifier,
  }: {
    code: string
    codeVerifier: string
  }) {
    const { ids } = this.config

    return this.postRequest<TokenResponse>('/connect/token', {
      grant_type: 'authorization_code',
      code,
      client_secret: ids.secret,
      client_id: ids.clientId,
      redirect_uri: this.config.callbacksRedirectUris.login,
      code_verifier: codeVerifier,
    })
  }

  /**
   * Use the refresh token to get a new tokens
   *
   * @param refreshToken - The refresh token
   */
  public async refreshToken(refreshToken: string) {
    const decryptedRefreshToken = this.cryptoService.decrypt(refreshToken)
    const { ids } = this.config

    return this.postRequest<TokenResponse>('/connect/token', {
      grant_type: 'refresh_token',
      refresh_token: decryptedRefreshToken,
      client_secret: ids.secret,
      client_id: ids.clientId,
    })
  }

  /**
   * This endpoint allows revoking access tokens (reference tokens only) and refresh token.
   *
   * @param token - The token to revoke
   * @param tokenTypeHint - The type of token to revoke (access_token or refresh_token)
   */
  public async revokeToken(
    token: string,
    tokenTypeHint: 'access_token' | 'refresh_token',
  ) {
    const decryptedToken = this.cryptoService.decrypt(token)
    const { ids } = this.config

    return this.postRequest('/connect/revocation', {
      token: decryptedToken,
      token_type_hint: tokenTypeHint,
      client_secret: ids.secret,
      client_id: ids.clientId,
    })
  }
}
