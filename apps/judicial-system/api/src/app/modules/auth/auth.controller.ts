import { createHash, randomBytes } from 'crypto'
import { Entropy } from 'entropy-string'
import { CookieOptions, Request, Response } from 'express'

import {
  Controller,
  Get,
  Inject,
  Param,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { type ConfigType } from '@island.is/nest/config'

import {
  AuditedAction,
  AuditTrailService,
} from '@island.is/judicial-system/audit-trail'
import {
  CurrentHttpUser,
  CurrentHttpUserNationalId,
  JwtAuthGuard,
  SharedAuthService,
} from '@island.is/judicial-system/auth'
import {
  ACCESS_TOKEN_COOKIE_NAME,
  CODE_VERIFIER_COOKIE_NAME,
  CSRF_COOKIE_NAME,
  EXPIRES_IN_MILLISECONDS,
  getUserDashboardRoute,
  IDS_ACCESS_TOKEN_NAME,
  IDS_ID_TOKEN_NAME,
  IDS_REFRESH_TOKEN_NAME,
  REFRESH_TOKEN_EXPIRES_IN_MILLISECONDS,
} from '@island.is/judicial-system/consts'
import {
  EventType,
  isAdminUser,
  isCourtOfAppealsUser,
  isDefenceUser,
  isDistrictCourtUser,
  isPrisonSystemUser,
  isProsecutionUser,
  isPublicProsecutionOfficeUser,
  type User,
} from '@island.is/judicial-system/types'

import { authModuleConfig } from './auth.config'
import { AuthService } from './auth.service'
import { Cookie } from './auth.types'

const REDIRECT_COOKIE_NAME = 'judicial-system.redirect'

@Controller('api/auth')
export class AuthController {
  private readonly defaultCookieOptions: CookieOptions = {
    httpOnly: true,
    sameSite: 'lax',
  }

  private readonly redirectCookie: Cookie = {
    name: REDIRECT_COOKIE_NAME,
    options: {
      ...this.defaultCookieOptions,
      sameSite: 'none', // this only works when the secure attribute is set to true
      secure: true,
    },
  }

  private readonly accessTokenCookie: Cookie = {
    name: ACCESS_TOKEN_COOKIE_NAME,
    options: this.defaultCookieOptions,
  }

  private readonly codeVerifierCookie: Cookie = {
    name: CODE_VERIFIER_COOKIE_NAME,
    options: this.defaultCookieOptions,
  }

  private readonly csrfCookie: Cookie = {
    name: CSRF_COOKIE_NAME,
    options: {
      ...this.defaultCookieOptions,
      httpOnly: false,
    },
  }

  private readonly idToken: Cookie = {
    name: IDS_ID_TOKEN_NAME,
    options: this.defaultCookieOptions,
  }

  // TEMP: To begin with we will store the two tokens in the session cookie as we do with other tokens.
  // In the future based on usage, we might consider storing it not in the session cookie
  private readonly accessToken: Cookie = {
    name: IDS_ACCESS_TOKEN_NAME,
    options: this.defaultCookieOptions,
  }

  private readonly refreshToken: Cookie = {
    name: IDS_REFRESH_TOKEN_NAME,
    options: this.defaultCookieOptions,
  }

  constructor(
    private readonly auditTrailService: AuditTrailService,
    private readonly authService: AuthService,
    private readonly sharedAuthService: SharedAuthService,

    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
    @Inject(authModuleConfig.KEY)
    private readonly config: ConfigType<typeof authModuleConfig>,
  ) {
    this.defaultCookieOptions.secure = this.config.production
  }

  @Get(['login', 'login/:userId'])
  async login(
    @Res() res: Response,
    @Param('userId') userId?: string,
    @Query('redirectRoute') redirectRoute?: string,
    @Query('nationalId') nationalId?: string,
  ) {
    try {
      this.logger.debug('Received login request')

      // Local development
      if (this.config.allowAuthBypass && nationalId) {
        this.logger.debug(`Logging in using development mode`)

        await this.redirectAuthenticatedUser({
          nationalId,
          res,
          userId,
          requestedRedirectRoute: redirectRoute,
        })

        return
      }

      const buf = randomBytes(32)

      const codeVerifier = buf
        .toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '')

      const codeChallenge = createHash('sha256')
        .update(codeVerifier)
        .digest('base64')
        .replace(/=/g, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')

      const params = new URLSearchParams({
        response_type: 'code',
        scope: this.config.scope,
        code_challenge: codeChallenge,
        code_challenge_method: 'S256',
        redirect_uri: this.config.redirectUri,
        client_id: this.config.clientId,
      })

      const loginUrl = `${this.config.issuer}/connect/authorize?${params}`

      this.clearCookies(res, [
        this.idToken,
        this.csrfCookie,
        this.accessTokenCookie,
      ])

      res.cookie(
        this.codeVerifierCookie.name,
        codeVerifier,
        this.codeVerifierCookie.options,
      )

      if (userId || redirectRoute) {
        res.cookie(
          this.redirectCookie.name,
          { userId, redirectRoute },
          this.redirectCookie.options,
        )
      }

      res.redirect(loginUrl)
    } catch (error) {
      this.logger.error('Login failed:', { error })

      this.clearCookies(res)

      res.redirect('/?villa=innskraning-villa')
    }
  }

  @Get('callback/identity-server')
  async callback(
    @Query('code') code: string,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    try {
      this.logger.debug('Received callback request')

      const { userId, redirectRoute } =
        req.cookies[this.redirectCookie.name] ?? {}
      const codeVerifier = req.cookies[this.codeVerifierCookie.name]

      const idsTokens = await this.authService.fetchIdsToken(code, codeVerifier)
      const verifiedUserToken = await this.authService.verifyIdsToken(
        idsTokens.id_token,
      )

      if (verifiedUserToken) {
        this.logger.debug('Token verification successful')

        await this.redirectAuthenticatedUser({
          nationalId: verifiedUserToken.nationalId,
          res,
          userId,
          requestedRedirectRoute: redirectRoute,
          idToken: idsTokens.id_token,
          csrfToken: new Entropy({ bits: 128 }).string(),
          accessToken: idsTokens.access_token,
          refreshToken: idsTokens.refresh_token,
        })

        return
      }
    } catch (error) {
      this.logger.error('Authentication callback failed:', { error })

      this.clearCookies(res)

      res.redirect('/?villa=innskraning-villa')

      return
    }

    this.clearCookies(res)

    res.redirect('/?villa=innskraning-ogild')
  }

  @UseGuards(JwtAuthGuard)
  @Get('token-refresh')
  async tokenRefresh(@Res() res: Response, @Req() req: Request) {
    try {
      this.logger.debug('Handling token expiry')

      const accessToken = req.cookies[this.idToken.name]
      if (!this.authService.isTokenExpired(accessToken)) {
        this.logger.debug('Token is valid')
        res.status(200).send()
        return
      }
      const refreshToken = req.cookies[this.refreshToken.name]
      const idsTokens = await this.authService.refreshToken(refreshToken)

      const verifiedUserToken = await this.authService.verifyIdsToken(
        idsTokens.id_token,
      )
      if (!verifiedUserToken) {
        throw new Error('Invalid id token')
      }

      const newAccessToken = idsTokens.access_token
      const newRefreshToken = idsTokens.refresh_token
      if (newAccessToken && newRefreshToken) {
        res.cookie(this.accessToken.name, newAccessToken, {
          ...this.accessToken.options,
        })
        res.cookie(this.refreshToken.name, newRefreshToken, {
          ...this.refreshToken.options,
          maxAge: EXPIRES_IN_MILLISECONDS,
        })
      }
      this.logger.debug('Token refresh successful')
      res.status(200).send()
    } catch (error) {
      this.logger.error('Handling token expiry failed:', { error })

      this.clearCookies(res)

      res.redirect('/?villa=innskraning-villa')

      return
    }
  }

  @Get('callback')
  deprecatedAuth(@Res() res: Response) {
    this.logger.debug(
      'Received login request through a deprecated authentication system',
    )

    this.clearCookies(res)

    res.redirect('/?villa=innskraning-gomul')
  }

  @Get('logout')
  logout(@Res() res: Response, @Req() req: Request) {
    this.logger.debug('Received logout request')

    const idToken = req.cookies[this.idToken.name]
    const refreshToken = req.cookies[this.refreshToken.name]

    this.authService.revokeRefreshToken(refreshToken)

    this.clearCookies(res)

    if (idToken) {
      res.redirect(
        `${this.config.issuer}/connect/endsession?id_token_hint=${idToken}&post_logout_redirect_uri=${this.config.logoutRedirectUri}`,
      )

      return
    }

    res.redirect(this.config.logoutRedirectUri)
  }

  @UseGuards(JwtAuthGuard)
  @Get('activate/:userId')
  async activateUser(
    @Param('userId') userId: string,
    @CurrentHttpUserNationalId() nationalId: string,
    @Res() res: Response,
    @Req() req: Request,
    @CurrentHttpUser() user?: User,
  ) {
    try {
      this.logger.debug(`Received activate user ${userId} request`)

      if (user && userId === user.id) {
        this.redirect(res, user)

        return
      }

      const csrfCookieToken = req.cookies[this.csrfCookie.name]
      const csrfToken =
        csrfCookieToken === 'undefined' ? undefined : csrfCookieToken

      const eligibleUsers =
        await this.authService.findEligibleUsersByNationalId(nationalId)
      const currentUser = eligibleUsers.find((user) => user.id === userId)

      if (!currentUser) {
        this.logger.info('Blocking illegal user activation attempt')

        await this.authService.createEventLog({
          eventType: csrfToken
            ? EventType.LOGIN_UNAUTHORIZED
            : EventType.LOGIN_BYPASS_UNAUTHORIZED,
          nationalId: eligibleUsers[0].nationalId,
        })

        this.clearCookies(res)

        res.redirect('/?villa=innskraning-ogildur-notandi')

        return
      }

      // Use the optional redirect route only if a user has not yet been activated
      // Note that at this point, the redirect cookie does not contain a user id
      const { redirectRoute } = req.cookies[this.redirectCookie.name] ?? {}
      const useRedirectRoute = !user

      await this.redirectAuthorizeUser(
        nationalId,
        res,
        currentUser,
        csrfToken,
        useRedirectRoute ? redirectRoute : undefined,
      )
    } catch (error) {
      this.logger.error('Login failed:', { error })

      this.clearCookies(res)

      res.redirect('/?villa=innskraning-villa')
    }
  }

  private clearCookies(
    res: Response,
    cookies: Cookie[] = [
      this.codeVerifierCookie,
      this.idToken,
      this.redirectCookie,
      this.csrfCookie,
      this.accessTokenCookie,
    ],
  ) {
    const clearCookie = (cookie: Cookie) => {
      res.req.cookies[cookie.name] &&
        res.clearCookie(cookie.name, cookie.options)
    }

    cookies.forEach((cookie) => clearCookie(cookie))
  }

  private async redirectAuthenticatedUser({
    nationalId,
    res,
    userId,
    requestedRedirectRoute,
    idToken,
    csrfToken,
    accessToken,
    refreshToken,
  }: {
    nationalId: string
    res: Response
    userId?: string
    requestedRedirectRoute?: string
    idToken?: string
    csrfToken?: string
    accessToken?: string
    refreshToken?: string
  }) {
    const eligibleUsers = await this.authService.findEligibleUsersByNationalId(
      nationalId,
    )

    if (eligibleUsers.length === 0) {
      this.logger.info('Blocking login attempt from an unauthorized user')

      this.clearCookies(res)

      this.authService.createEventLog({
        eventType: csrfToken
          ? EventType.LOGIN_UNAUTHORIZED
          : EventType.LOGIN_BYPASS_UNAUTHORIZED,
        nationalId,
      })

      res.redirect('/?villa=innskraning-ekki-notandi')

      return
    }

    const currentUser =
      eligibleUsers.length === 1
        ? eligibleUsers[0]
        : userId
        ? // attempt to find the user with the given userId
          eligibleUsers.find((user) => user.id === userId)
        : undefined

    // Use the redirect route if:
    // - no user id accompanied the redirect route or
    // - the accompanying user id matches the user being activated
    const redirectRoute =
      !userId || currentUser?.id === userId ? requestedRedirectRoute : undefined

    if (idToken) {
      res.cookie(this.idToken.name, idToken, {
        ...this.idToken.options,
        maxAge: EXPIRES_IN_MILLISECONDS,
      })
      // expires in 5 minutes, can't be overridden
      res.cookie(this.accessToken.name, accessToken, {
        ...this.accessToken.options,
      })
      res.cookie(this.refreshToken.name, refreshToken, {
        ...this.refreshToken.options,
        maxAge: REFRESH_TOKEN_EXPIRES_IN_MILLISECONDS,
      })
    } else {
      this.clearCookies(res, [this.idToken])
    }

    return this.redirectAuthorizeUser(
      nationalId,
      res,
      currentUser,
      csrfToken,
      redirectRoute,
    )
  }

  private async redirectAuthorizeUser(
    currentUserNationalId: string,
    res: Response,
    currentUser?: User,
    csrfToken?: string,
    requestedRedirectRoute?: string,
  ) {
    if (currentUser) {
      await this.authService.createEventLog({
        eventType: csrfToken ? EventType.LOGIN : EventType.LOGIN_BYPASS,
        nationalId: currentUser.nationalId,
        userRole: currentUser.role,
        userName: currentUser.name,
        userTitle: currentUser.title,
        institutionName: currentUser.institution?.name,
      })
    }

    const jwtToken = this.sharedAuthService.signJwt(
      currentUserNationalId,
      currentUser,
      csrfToken,
    )

    res
      .cookie(
        this.csrfCookie.name,
        csrfToken as string,
        {
          ...this.csrfCookie.options,
          maxAge: EXPIRES_IN_MILLISECONDS,
        } as CookieOptions,
      )
      .cookie(this.accessTokenCookie.name, jwtToken, {
        ...this.accessTokenCookie.options,
        maxAge: EXPIRES_IN_MILLISECONDS,
      })

    this.redirect(res, currentUser, requestedRedirectRoute)
  }

  private getRedirectRouteForUser(
    currentUser: User,
    requestedRedirectRoute?: string,
  ) {
    const getRedirectRoute = (allowedPrefixes: string[]) => {
      const isValidRequestedRedirectRoute =
        requestedRedirectRoute &&
        allowedPrefixes.some((prefix) =>
          requestedRedirectRoute.startsWith(prefix),
        )
      return isValidRequestedRedirectRoute
        ? requestedRedirectRoute
        : getUserDashboardRoute(currentUser)
    }

    if (isProsecutionUser(currentUser)) {
      return getRedirectRoute([
        '/beinir',
        '/krafa',
        '/kaera',
        '/greinargerd',
        '/akaera',
      ])
    }

    if (isPublicProsecutionOfficeUser(currentUser)) {
      return getRedirectRoute(['/beinir', '/krafa/yfirlit', '/rikissaksoknari'])
    }

    if (isDistrictCourtUser(currentUser)) {
      return getRedirectRoute(['/beinir', '/krafa/yfirlit', '/domur'])
    }

    if (isCourtOfAppealsUser(currentUser)) {
      return getRedirectRoute(['/landsrettur'])
    }

    if (isPrisonSystemUser(currentUser)) {
      return getRedirectRoute(['/beinir', '/krafa/yfirlit', '/fangelsi'])
    }

    if (isDefenceUser(currentUser)) {
      return getRedirectRoute(['/krafa/yfirlit', '/verjandi'])
    }

    if (isAdminUser(currentUser)) {
      return getRedirectRoute(['/notendur'])
    }

    return '/'
  }

  private redirect(
    res: Response,
    currentUser?: User,
    requestedRedirectRoute?: string,
  ) {
    this.clearCookies(res, [this.codeVerifierCookie])

    if (currentUser) {
      this.clearCookies(res, [this.redirectCookie])

      const redirectRoute = this.getRedirectRouteForUser(
        currentUser,
        requestedRedirectRoute,
      )

      this.auditTrailService.audit(
        currentUser.id,
        AuditedAction.LOGIN,
        res.redirect(redirectRoute),
        currentUser.id,
      )

      return
    }

    res
      .cookie(
        this.redirectCookie.name,
        { redirectRoute: requestedRedirectRoute },
        this.redirectCookie.options,
      )
      .redirect('/')
  }
}
