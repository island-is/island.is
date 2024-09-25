import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { BadRequestException, Inject, Injectable } from '@nestjs/common'
import { ConfigType } from '@nestjs/config'
import { CookieOptions, Response } from 'express'
import { jwtDecode } from 'jwt-decode'

import { IdTokenClaims } from '@island.is/shared/types'
import { uuid } from 'uuidv4'
import { environment } from '../../../environment'
import { BffConfig } from '../../bff.config'
import { SESSION_COOKIE_NAME } from '../../constants/cookies'
import { CryptoService } from '../../services/crypto.service'
import {
  CreateErrorQueryStrArgs,
  createErrorQueryStr,
} from '../../utils/create-error-query-str'
import { validateUri } from '../../utils/validate-uri'
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
    private readonly cryptoService: CryptoService,
  ) {
    this.baseUrl = this.config.ids.issuer
  }

  private getCookieOptions(): CookieOptions {
    return {
      httpOnly: true,
      secure: true,
      // 'strict' (Maximum Security) The cookie will only be sent for requests originating from the same site (same domain and subdomain).
      sameSite: 'strict',
      path: environment.keyPath,
    }
  }

  /**
   * Creates the client base URL with the path appended.
   */
  private createClientBaseUrl() {
    return `${this.config.clientBaseUrl}${environment.keyPath}`
  }

  /**
   * Redirects the user to the client base URL with an error query string.
   */
  private createClientBaseUrlWithError(args: CreateErrorQueryStrArgs) {
    return `${this.createClientBaseUrl()}?${createErrorQueryStr(args)}`
  }

  /**
   * Redirects the user to the client base URL with an error query string.
   */
  private redirectWithError(
    res: Response,
    args?: Partial<CreateErrorQueryStrArgs>,
  ) {
    const code = args?.code || 500
    const error = args?.error || 'Login failed!'

    return res.redirect(this.createClientBaseUrlWithError({ code, error }))
  }

  /**
   * Formats and updates the token cache with new token response data.
   */
  public async updateTokenCache(
    tokenResponse: TokenResponse,
  ): Promise<CachedTokenResponse> {
    const userProfile: IdTokenClaims = jwtDecode(tokenResponse.id_token)

    const value: CachedTokenResponse = {
      ...tokenResponse,
      // Encrypt the access and refresh tokens before saving them to the cache
      // to prevent unauthorized access to the tokens if cached service is compromised.
      access_token: this.cryptoService.encrypt(tokenResponse.access_token),
      refresh_token: this.cryptoService.encrypt(tokenResponse.refresh_token),
      scopes: tokenResponse.scope.split(' '),
      userProfile,
      // Subtract 5 seconds from the token expiration time to account for latency.
      accessTokenExp: Date.now() + (tokenResponse.expires_in * 1000 - 5000),
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
   * This method initiates the login flow.
   * It validates the target_link_uri and generates a unique session id, for a login attempt.
   * It also generates a code verifier and code challenge to enhance security.
   * The login attempt data is saved in the cache and a PAR request is made to the identity server.
   * The user is then redirected to the identity server login page.
   */
  async login({
    res,
    query: { target_link_uri: targetLinkUri, login_hint: loginHint, prompt },
  }: {
    res: Response
    query: LoginQuery
  }) {
    // Validate targetLinkUri if it is provided
    if (
      targetLinkUri &&
      !validateUri(targetLinkUri, this.config.allowedRedirectUris)
    ) {
      this.logger.error('Invalid target_link_uri provided:', targetLinkUri)

      return this.redirectWithError(res, {
        code: 400,
      })
    }

    try {
      // Generate a unique session id to be used in the login flow
      const sid = uuid()

      // Generate a code verifier and code challenge to enhance security
      const codeVerifier = await this.pkceService.generateCodeVerifier()
      const codeChallenge = await this.pkceService.generateCodeChallenge(
        codeVerifier,
      )

      await this.cacheService.save({
        key: this.cacheService.createSessionKeyType('attempt', sid),
        value: {
          // Fallback if targetLinkUri is not provided
          originUrl: this.createClientBaseUrl(),
          // Code verifier to be used in the callback
          codeVerifier,
          targetLinkUri: targetLinkUri,
          ...(loginHint && { loginHint }),
          ...(prompt && { prompt }),
        },
        ttl: 60 * 60 * 24 * 7 * 1000, // 1 week
      })

      let searchParams: URLSearchParams

      if (this.config.parSupportEnabled) {
        const parResponse = await this.idsService.getPar({
          sid,
          codeChallenge,
          loginHint,
          prompt,
        })

        searchParams = new URLSearchParams({
          request_uri: parResponse.request_uri,
          client_id: this.config.ids.clientId,
        })
      } else {
        searchParams = new URLSearchParams(
          this.idsService.getLoginSearchParams({
            sid,
            codeChallenge,
            loginHint,
            prompt,
          }),
        )
      }

      return res.redirect(
        `${this.baseUrl}/connect/authorize?${searchParams.toString()}`,
      )
    } catch (error) {
      this.logger.error('Login failed: ', error)

      return this.redirectWithError(res)
    }
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
    const idsError = query.invalid_request

    // IDS might respond with an error if the request is missing a required parameter.
    if (idsError) {
      this.logger.error('Callback login IDS invalid request: ', idsError)

      return this.redirectWithError(res, {
        code: 500,
        error: idsError,
      })
    }

    // Validate query params
    if (!query.code || !query.state) {
      const missingParam = !query.code ? 'code' : 'state'
      this.logger.error(
        `Callback login failed: No query param "${missingParam}" provided.`,
      )

      return this.redirectWithError(res, {
        code: 400,
      })
    }

    try {
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
      res.cookie(
        SESSION_COOKIE_NAME,
        value.userProfile.sid,
        this.getCookieOptions(),
      )

      return res.redirect(
        loginAttemptData.targetLinkUri || loginAttemptData.originUrl,
      )
    } catch (error) {
      this.logger.error('Callback login failed: ', error)

      return this.redirectWithError(res)
    }
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
      post_logout_redirect_uri: this.config.callbacksRedirectUris.logout,
      state: encodeURIComponent(JSON.stringify({ sid })),
    })

    return res.redirect(
      `${this.baseUrl}/connect/endsession?${searchParams.toString()}`,
    )
  }

  /**
   * Callback for the logout flow.
   * This method is called from the identity server after the user has logged out.
   * We clean up the current login from the cache and delete the session cookie.
   * Finally, we redirect the user back to the original URL.
   */
  async callbackLogout(res: Response, { state }: CallbackLogoutQuery) {
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
    res.clearCookie(SESSION_COOKIE_NAME, this.getCookieOptions())

    return res.redirect(this.config.logoutRedirectUri)
  }
}
