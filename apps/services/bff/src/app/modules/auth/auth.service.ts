import { Logger, LOGGER_PROVIDER } from '@island.is/logging'
import { BadRequestException, Inject, Injectable } from '@nestjs/common'
import { ConfigType } from '@nestjs/config'
import { Request, Response } from 'express'

import { uuid } from 'uuidv4'
import { environment } from '../../../environment'
import { BffConfig } from '../../bff.config'
import { CacheService } from '../cache/cache.service'
import { CallbackLoginQueryDto } from './dto/callback-login-query.dto'
import { LoginQueryDto } from './dto/login-query.dto'
import { PKCEService } from './pkce.service'
import { TokenResponse } from './auth.types'

export type ParResponse = {
  request_uri: string
  expires_in: number
}

@Injectable()
export class AuthService {
  private readonly baseUrl

  constructor(
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,

    @Inject(BffConfig.KEY)
    private readonly config: ConfigType<typeof BffConfig>,

    private readonly pkceService: PKCEService,
    private readonly cacheService: CacheService,
  ) {
    this.baseUrl = this.config.auth.issuer
  }

  /**
   * Validates the redirect URI to ensure blocking of external URLs.
   */
  private async validateRedirectUri(uri: string, allowedUris: string[]) {
    // Convert wildcard patterns to regular expressions
    const regexPatterns = allowedUris.map((pattern) => {
      // Escape special regex characters and replace '*' with a regex pattern to match any characters
      const regexPattern = pattern
        // Escape special characters for regex
        .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
        // Convert '*' to '.*' to match any characters
        .replace(/\\\*/g, '.*')

      // Create a regex from the pattern and ensure it matches the entire URL
      return new RegExp(`^${regexPattern}$`)
    })

    // Check if the URL matches any of the allowed patterns
    return regexPatterns.some((regex) => regex.test(uri))
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
      this.logger.error(`Error making request to ${endpoint}:`, error)

      throw new BadRequestException(`Failed to fetch from ${endpoint}`)
    }
  }

  /**
   * Fetches the PAR (Pushed Authorization Requests) from the Ids
   */
  private async fetchPAR({
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
      redirect_uri: this.config.auth.callbacksLoginRedirectUri,
      response_type: 'code',
      response_mode: 'query',
      scope: ['openid', 'profile', this.config.auth.scopes].join(' '),
      state: sid,
      code_challenge: codeChallenge,
      code_challenge_method: 'S256',
      ...(loginHint && { login_hint: loginHint }),
    })
  }

  // Fetches tokens using the authorization code and code verifier
  private async fetchTokens({
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
      redirect_uri: this.config.auth.callbacksLoginRedirectUri,
      code_verifier: codeVerifier,
    })
  }

  async login({
    req,
    res,
    query: { target_link_uri: targetLinkUri, login_hint: loginHint },
  }: {
    req: Request
    res: Response
    query: LoginQueryDto
  }) {
    // Validate targetLinkUri if it is provided
    if (
      targetLinkUri &&
      !this.validateRedirectUri(
        targetLinkUri,
        this.config.auth.allowedRedirectUris,
      )
    ) {
      throw new BadRequestException('Invalid target_link_uri')
    }

    // Generate a unique session id to be used in the login flow
    const sid = uuid()

    // Generate a code verifier and code challenge to enhance security
    const codeVerifier = await this.pkceService.generateCodeVerifier()
    const codeChallenge = await this.pkceService.generateCodeChallenge(
      codeVerifier,
    )

    // Get the calling URL
    const originUrl = `${(
      req.headers['origin'] ||
      req.headers['referer'] ||
      ''
    ).replace(/\/$/, '')}${environment.globalPrefix}`

    await this.cacheService.save({
      key: this.cacheService.createSessionKeyType('attempt', sid),
      value: {
        // Fallback if targetLinkUri is not provided
        originUrl,
        targetLinkUri: targetLinkUri,
        ...(loginHint && { loginHint }),
        // Code verifier to be used in the callback
        codeVerifier,
      },
      ttl: 60 * 60 * 24 * 7 * 1000, // 1 week
    })

    const parResponse = await this.fetchPAR({ sid, codeChallenge, loginHint })

    return res.redirect(
      `${this.baseUrl}/connect/authorize?request_uri=${parResponse.request_uri}&client_id=${this.config.auth.clientId}`,
    )
  }

  async callback(res: Response, query: CallbackLoginQueryDto) {
    // Get login attempt from cache
    const loginAttemptData = await this.cacheService.get<{
      targetLinkUri?: string
      loginHint?: string
      codeVerifier: string
      originUrl: string
    }>(this.cacheService.createSessionKeyType('attempt', query.state))

    // Get tokens and user information from the authorization code
    const tokenResponse = await this.fetchTokens({
      code: query.code,
      codeVerifier: loginAttemptData.codeVerifier,
    })

    const sid = uuid()

    // Save the tokenResponse to the cache
    await this.cacheService.save({
      key: this.cacheService.createSessionKeyType('current', sid),
      value: tokenResponse,
      ttl: 60 * 60 * 1000, // 1 hour
    })

    // Clean up the login attempt from the cache since we have a successful login.
    await this.cacheService.delete(
      this.cacheService.createSessionKeyType('attempt', query.state),
    )

    // Create session cookie with successful login session id
    res.cookie('sid', sid, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    })

    return res.redirect(
      loginAttemptData.targetLinkUri || loginAttemptData.originUrl,
    )
  }
}
