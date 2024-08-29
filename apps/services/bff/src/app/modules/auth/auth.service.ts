import { Logger, LOGGER_PROVIDER } from '@island.is/logging'
import { BadRequestException, Inject, Injectable } from '@nestjs/common'
import { ConfigType } from '@nestjs/config'
import { Cache as CacheManager } from 'cache-manager'
import { Response } from 'express'

import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { uuid } from 'uuidv4'
import { BffConfig } from '../../bff.config'
import { CallbackLoginQueryDto } from './dto/callback-login-query.dto'
import { LoginQueryDto } from './dto/login-query.dto'
import { PKCEService } from './pkce.service'

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

    @Inject(CACHE_MANAGER)
    private readonly cacheManager: CacheManager,

    private readonly pkceService: PKCEService,
  ) {
    this.baseUrl = this.config.auth.issuer
  }

  private async saveToCache({
    key,
    value,
    ttl
  }: {
    key: string
    value: unknown
    // Time to live in milliseconds
    ttl?: number
  }): Promise<void> {
    await this.cacheManager.set(key, value, ttl)
  }

  private async getFromCache<Value>(key: string) {
    const value = await this.cacheManager.get(key)

    if (!value) {
      throw new BadRequestException('Not found')
    }

    return value as Value
  }

  /**
   * Creates s unique key with session id.
   * type is either 'attempt' or 'current'
   * attempt represents the login attempt
   * current represents the current login session
   */
  private createSessionKeyType(type: 'attempt' | 'current', sid: string) {
    return `${type}_${sid}`
  }

  /**
   * Validates the redirect URI to ensure blocking of external URLs.
   */
  private async validateRedirectUri(uri: string, allowedUris: string[]) {
    // Convert wildcard patterns to regular expressions
    const regexPatterns = allowedUris.map((pattern) => {
      // Escape special regex characters and replace '*' with a regex pattern to match any characters
      const regexPattern = pattern
        .replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // Escape special characters for regex
        .replace(/\\\*/g, '.*') // Convert '*' to '.*' to match any characters

      // Create a regex from the pattern and ensure it matches the entire URL
      return new RegExp(`^${regexPattern}$`)
    })

    // Check if the URL matches any of the allowed patterns
    return regexPatterns.some((regex) => regex.test(uri))
  }

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
  }: {
    sid: string
    codeChallenge: string
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
    return this.postRequest('/connect/token', {
      grant_type: 'authorization_code',
      code,
      client_secret: this.config.auth.secret,
      client_id: this.config.auth.clientId,
      redirect_uri: this.config.auth.callbacksLoginRedirectUri,
      code_verifier: codeVerifier,
    })
  }

  async login(
    res: Response,
    { target_link_uri: targetLinkUri, login_hint: loginHint }: LoginQueryDto,
  ) {
    // Validate return_url if it is provided
    if (
      targetLinkUri &&
      !this.validateRedirectUri(
        targetLinkUri,
        this.config.auth.allowedRedirectUris,
      )
    ) {
      throw new BadRequestException('Invalid return_url')
    }

    const sid = uuid()
    const codeVerifier = await this.pkceService.generateCodeVerifier()
    const codeChallenge = await this.pkceService.generateCodeChallenge(
      codeVerifier,
    )

    await this.saveToCache({
      key: this.createSessionKeyType('attempt', sid),
      value: {
        targetLinkUri,
        ...(loginHint && { loginHint }),
        // Code verifier to be used in the callback
        codeVerifier,
      },
      ttl: 60 * 60 * 24 * 7, // 1 week
    })

    const parResponse = await this.fetchPAR({ sid, codeChallenge })

    return res.redirect(
      `${this.baseUrl}/connect/authorize?request_uri=${parResponse.request_uri}&client_id=${this.config.auth.clientId}`,
    )
  }

  async callback(res: Response, query: CallbackLoginQueryDto) {
    // Get login attempt from cache
    const loginAttemptData = await this.getFromCache<{
      targetLinkUri?: string
      loginHint?: string
      codeVerifier: string
    }>(this.createSessionKeyType('attempt', query.state))

    // Get tokens from the authorization code
    const tokenResponse = await this.fetchTokens({
      code: query.code,
      codeVerifier: loginAttemptData.codeVerifier,
    })

    const sid = uuid()

    // Save the tokenResponse to the cache
    await this.saveToCache({
      key: this.createSessionKeyType('current', sid),
      value: tokenResponse,
      ttl: 60 * 60, // 1 hour
    })

    // Clean up the login attempt from the cache since we have a successful login.
    await this.cacheManager.del(
      this.createSessionKeyType('attempt', query.state),
    )

    // Create session cookie with successful login session id
    res.cookie('sid', sid, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    })

    return res.redirect(loginAttemptData.targetLinkUri || '/')
  }
}
