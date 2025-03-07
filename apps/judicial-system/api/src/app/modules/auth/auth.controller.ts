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
  EligibleHttpUsers,
  JwtAuthGuard,
  SharedAuthService,
} from '@island.is/judicial-system/auth'
import {
  ACCESS_TOKEN_COOKIE_NAME,
  CASES_ROUTE,
  CODE_VERIFIER_COOKIE_NAME,
  COURT_OF_APPEAL_CASES_ROUTE,
  CSRF_COOKIE_NAME,
  DEFENDER_CASES_ROUTE,
  EXPIRES_IN_MILLISECONDS,
  IDS_ID_TOKEN_NAME,
  PRISON_CASES_ROUTE,
  USERS_ROUTE,
} from '@island.is/judicial-system/consts'
import {
  EventType,
  InstitutionType,
  isPrisonSystemUser,
  type User,
  UserRole,
} from '@island.is/judicial-system/types'

import { BackendService } from '../backend'
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
      sameSite: 'none',
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

  constructor(
    private readonly auditTrailService: AuditTrailService,
    private readonly authService: AuthService,
    private readonly backendService: BackendService,
    private readonly sharedAuthService: SharedAuthService,

    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
    @Inject(authModuleConfig.KEY)
    private readonly config: ConfigType<typeof authModuleConfig>,
  ) {
    this.defaultCookieOptions.secure = this.config.production
  }

  @Get('login')
  async login(
    @Res() res: Response,
    @Query('redirectRoute') redirectRoute?: string,
    @Query('nationalId') nationalId?: string,
  ) {
    try {
      this.logger.debug('Received login request')

      // Local development
      if (this.config.allowAuthBypass && nationalId) {
        this.logger.debug(`Logging in using development mode`)

        await this.redirectAuthenticatedUser(nationalId, res, redirectRoute)

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

      res
        .cookie(
          this.codeVerifierCookie.name,
          codeVerifier,
          this.codeVerifierCookie.options,
        )
        .cookie(
          this.redirectCookie.name,
          { redirectRoute },
          this.redirectCookie.options,
        )
        .redirect(loginUrl)
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

      const { redirectRoute } = req.cookies[this.redirectCookie.name] ?? {}
      const codeVerifier = req.cookies[this.codeVerifierCookie.name]

      const idsTokens = await this.authService.fetchIdsToken(code, codeVerifier)
      const verifiedUserToken = await this.authService.verifyIdsToken(
        idsTokens.id_token,
      )

      if (verifiedUserToken) {
        this.logger.debug('Token verification successful')

        await this.redirectAuthenticatedUser(
          verifiedUserToken.nationalId,
          res,
          redirectRoute,
          idsTokens.id_token,
          new Entropy({ bits: 128 }).string(),
        )

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
    @CurrentHttpUser() user: User,
    @EligibleHttpUsers() eligibleUsers: User[],
    @Res() res: Response,
    @Req() req: Request,
  ) {
    try {
      this.logger.debug(`Received activate user ${userId} request`)

      if (userId === user?.id) {
        return this.redirect(res, user)
      }

      const csrfToken = req.cookies[this.csrfCookie.name]

      const userIdx = eligibleUsers.findIndex((user) => user.id === userId)

      if (userIdx < 0) {
        this.logger.info('Blocking illegal user activation attempt')

        await this.backendService.createEventLog({
          eventType: csrfToken
            ? EventType.LOGIN_UNAUTHORIZED
            : EventType.LOGIN_BYPASS_UNAUTHORIZED,
          nationalId: eligibleUsers[0].nationalId,
        })

        this.clearCookies(res)

        res.redirect('/?villa=innskraning-ogildur-notandi')

        return
      }

      // this.clearCookies(res, false)
      this.redirectAuthorizeUser(
        eligibleUsers,
        userIdx,
        res,
        csrfToken === 'undefined' ? undefined : csrfToken,
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

  private async findEligibleUsersByNationalId(nationalId: string) {
    const users = await this.authService.findUsersByNationalId(nationalId)

    if (users) {
      return users
    }

    const defender = await this.authService.findDefender(nationalId)

    if (defender) {
      return [defender]
    }

    return []
  }

  private async redirectAuthenticatedUser(
    nationalId: string,
    res: Response,
    requestedRedirectRoute?: string,
    idToken?: string,
    csrfToken?: string,
  ) {
    const eligibleUsers = await this.findEligibleUsersByNationalId(nationalId)

    if (eligibleUsers.length === 0) {
      this.logger.info('Blocking login attempt from an unauthorized user')

      this.clearCookies(res)

      res.redirect('/?villa=innskraning-ekki-notandi')

      return
    }

    const currentUserIdx = eligibleUsers.length === 1 ? 0 : -1

    if (idToken) {
      res.cookie(this.idToken.name, idToken, {
        ...this.idToken.options,
        maxAge: EXPIRES_IN_MILLISECONDS,
      })
    } else {
      this.clearCookies(res, [this.idToken])
    }

    this.redirectAuthorizeUser(
      eligibleUsers,
      currentUserIdx,
      res,
      csrfToken,
      requestedRedirectRoute,
    )
  }

  private redirectAuthorizeUser(
    eligibleUsers: User[], // eligibleUsers is an array of one or more users
    currentUserIdx: number,
    res: Response,
    csrfToken?: string,
    requestedRedirectRoute?: string,
  ) {
    const currentUser =
      currentUserIdx < 0 ? undefined : eligibleUsers[currentUserIdx]

    if (currentUser) {
      this.backendService.createEventLog({
        eventType: csrfToken ? EventType.LOGIN : EventType.LOGIN_BYPASS,
        nationalId: currentUser.nationalId,
        userRole: currentUser.role,
        userName: currentUser.name,
        userTitle: currentUser.title,
        institutionName: currentUser.institution?.name,
      })
    }

    const jwtToken = this.sharedAuthService.signJwt(
      currentUserIdx,
      eligibleUsers,
      csrfToken,
    )

    this.clearCookies(res, [this.codeVerifierCookie, this.redirectCookie])

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

  private redirect(
    res: Response,
    currentUser?: User,
    requestedRedirectRoute?: string,
  ) {
    const redirectRoute = !currentUser
      ? '/'
      : requestedRedirectRoute && requestedRedirectRoute.startsWith('/') // Guard against invalid redirects
      ? requestedRedirectRoute
      : currentUser.role === UserRole.ADMIN
      ? USERS_ROUTE
      : currentUser.role === UserRole.DEFENDER
      ? DEFENDER_CASES_ROUTE
      : currentUser.institution?.type === InstitutionType.COURT_OF_APPEALS
      ? COURT_OF_APPEAL_CASES_ROUTE
      : isPrisonSystemUser(currentUser)
      ? PRISON_CASES_ROUTE
      : CASES_ROUTE

    const ret = res.redirect(redirectRoute)

    if (currentUser) {
      this.auditTrailService.audit(
        currentUser.id,
        AuditedAction.LOGIN,
        ret,
        currentUser.id,
      )
    }
  }
}
