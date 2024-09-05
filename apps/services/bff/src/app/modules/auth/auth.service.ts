import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { BadRequestException, Inject, Injectable } from '@nestjs/common'
import { ConfigType } from '@nestjs/config'
import { Request, Response } from 'express'
import { jwtDecode } from 'jwt-decode'

import { IdTokenClaims } from '@island.is/shared/types'
import omit from 'lodash/omit'
import { uuid } from 'uuidv4'
import { environment } from '../../../environment'
import { BffConfig } from '../../bff.config'
import { CacheService } from '../cache/cache.service'
import { IdsService } from '../ids/ids.service'
import { TokenResponse } from '../ids/ids.types'
import { CachedTokenResponse } from './auth.types'
import { PKCEService } from './pkce.service'
import { CallbackLoginQuery } from './queries/callback-login.query'
import { CallbackLogoutQuery } from './queries/callback-logout.query'
import { LoginQuery } from './queries/login.query'
import { LogoutQuery } from './queries/logout.query'

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
    private readonly idsService: IdsService,
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
   * Formats and updates the token cache with new token response data.
   */
  public async updateTokenCache(
    tokenResponse: TokenResponse,
  ): Promise<CachedTokenResponse> {
    const userProfile: IdTokenClaims = jwtDecode(tokenResponse.id_token)
    const decodedAccessToken = jwtDecode(tokenResponse.access_token)

    const value: CachedTokenResponse = {
      ...omit(tokenResponse, ['scope']),
      scopes: tokenResponse.scope.split(' '),
      userProfile,
      accessTokenExp:
        // Prefer the exact expiration time from the access token
        decodedAccessToken.exp ||
        // Fallback to token response expiration time in seconds
        new Date(Date.now() + tokenResponse.expires_in * 1000).getTime(),
    }

    // Save the tokenResponse to the cache
    await this.cacheService.save({
      key: this.cacheService.createSessionKeyType('current', userProfile.sid),
      value,
      ttl: 60 * 60 * 1000, // 1 hour
    })

    return value
  }

  /**
   * Get the origin URL from the request headers and add the global prefix
   */
  private getOriginUrl(req: Request) {
    return `${(req.headers['origin'] || req.headers['referer'] || '')
      // Remove trailing slash and add the client base path
      .replace(/\/$/, '')}${environment.clientBasePath}`
  }

  /**
   * This method initiates the login flow.
   * It validates the target_link_uri and generates a unique session id, for a login attempt.
   * It also generates a code verifier and code challenge to enhance security.
   * The login attempt data is saved in the cache and a PAR request is made to the identity server.
   * The user is then redirected to the identity server login page.
   */
  async login({
    req,
    res,
    query: { target_link_uri: targetLinkUri, login_hint: loginHint },
  }: {
    req: Request
    res: Response
    query: LoginQuery
  }) {
    // Validate targetLinkUri if it is provided
    if (
      targetLinkUri &&
      !this.validateRedirectUri(
        targetLinkUri,
        this.config.auth.allowedRedirectUris,
      )
    ) {
      this.logger.error('Invalid target_link_uri provided:', targetLinkUri)

      throw new BadRequestException('Login failed')
    }

    // Generate a unique session id to be used in the login flow
    const sid = uuid()

    // Generate a code verifier and code challenge to enhance security
    const codeVerifier = await this.pkceService.generateCodeVerifier()
    const codeChallenge = await this.pkceService.generateCodeChallenge(
      codeVerifier,
    )

    // Get the calling URL
    const originUrl = this.getOriginUrl(req)

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

    const parResponse = await this.idsService.getPar({
      sid,
      codeChallenge,
      loginHint,
    })

    const searchParams = new URLSearchParams({
      request_uri: parResponse.request_uri,
      client_id: this.config.auth.clientId,
    }).toString()

    return res.redirect(`${this.baseUrl}/connect/authorize?${searchParams}`)
  }

  /**
   * Callback for the login flow
   * This method is called from the identity server after the user has logged in
   * and the authorization code has been issued.
   * The authorization code is then exchanged for tokens.
   * We then save the tokens as well as decoded id token to the cache and create a session cookie.
   * Finally, we redirect the user back to the original URL.
   */
  async callbackLogin(res: Response, query: CallbackLoginQuery) {
    // Get login attempt from cache
    const loginAttemptData = await this.cacheService.get<{
      targetLinkUri?: string
      loginHint?: string
      codeVerifier: string
      originUrl: string
    }>(this.cacheService.createSessionKeyType('attempt', query.state))

    // Get tokens and user information from the authorization code
    const tokenResponse = await this.idsService.getTokens({
      code: query.code,
      codeVerifier: loginAttemptData.codeVerifier,
    })

    const value = await this.updateTokenCache(tokenResponse)

    // Clean up the login attempt from the cache since we have a successful login.
    await this.cacheService.delete(
      this.cacheService.createSessionKeyType('attempt', query.state),
    )

    // Create session cookie with successful login session id
    res.cookie('sid', value.userProfile.sid, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    })

    return res.redirect(
      loginAttemptData.targetLinkUri || loginAttemptData.originUrl,
    )
  }

  /**
   * This method initiates the logout flow.
   * It gets necessary data from the cache and constructs a logout URL.
   * The user is then redirected to the identity server logout page.
   */
  async logout({ res, query: { sid } }: { res: Response; query: LogoutQuery }) {
    const currentLoginCacheKey = this.cacheService.createSessionKeyType(
      'current',
      sid,
    )

    const cachedTokenResponse =
      await this.cacheService.get<CachedTokenResponse>(currentLoginCacheKey)

    const searchParams = new URLSearchParams({
      id_token_hint: cachedTokenResponse.id_token,
      post_logout_redirect_uri: this.config.auth.callbacksRedirectUris.logout,
      state: encodeURIComponent(JSON.stringify({ sid })),
    })

    return res.redirect(`${this.baseUrl}/connect/endsession?${searchParams}`)
  }

  /**
   * Callback for the logout flow.
   * This method is called from the identity server after the user has logged out.
   * We clean up the current login from the cache and delete the session cookie.
   * Finally, we redirect the user back to the original URL.
   */
  async callbackLogout(res: Response, { state }: CallbackLogoutQuery) {
    if (!state) {
      this.logger.error('Logout failed: No state param provided')

      throw new BadRequestException('Logout failed')
    }

    const { sid } = JSON.parse(decodeURIComponent(state))

    if (!sid) {
      this.logger.error(
        'Logout failed: Invalid state param provided. No sid (session id) found',
      )

      throw new BadRequestException('Logout failed')
    }

    const currentLoginCacheKey = this.cacheService.createSessionKeyType(
      'current',
      state,
    )

    // Clean up current login from the cache since we have a successful logout.
    await this.cacheService.delete(currentLoginCacheKey)

    // Delete session cookie
    res.clearCookie('sid')

    return res.redirect(environment.auth.logoutRedirectUri)
  }
}
