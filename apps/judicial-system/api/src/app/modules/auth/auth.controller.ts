import { createHash, randomBytes } from 'crypto'
import { Entropy } from 'entropy-string'
import { CookieOptions, Request, Response } from 'express'

import { Controller, Get, Inject, Query, Req, Res } from '@nestjs/common'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { type ConfigType } from '@island.is/nest/config'

import {
  AuditedAction,
  AuditTrailService,
} from '@island.is/judicial-system/audit-trail'
import { SharedAuthService } from '@island.is/judicial-system/auth'
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
  UserRole,
} from '@island.is/judicial-system/types'

import { BackendService } from '../backend'
import { authModuleConfig } from './auth.config'
import { AuthService } from './auth.service'
import { AuthUser, Cookie } from './auth.types'

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
  login(
    @Query('redirectRoute') redirectRoute: string,
    @Query('nationalId') nationalId: string,
    @Res() res: Response,
  ) {
    this.logger.debug('Received login request')

    const { name, options } = this.redirectCookie

    res.clearCookie(name, options)
    res.clearCookie(
      this.codeVerifierCookie.name,
      this.codeVerifierCookie.options,
    )

    // Local development
    if (this.config.allowAuthBypass && nationalId) {
      this.logger.debug(`Logging in using development mode`)

      return this.redirectAuthenticatedUser(
        {
          nationalId,
        },
        res,
        redirectRoute,
      )
    }

    randomBytes(32, (err, buf) => {
      if (err) {
        this.logger.error('Failed to generate code verifier', { err })
      } else {
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

        res
          .cookie(name, { redirectRoute }, options)
          .cookie(
            this.codeVerifierCookie.name,
            codeVerifier,
            this.codeVerifierCookie.options,
          )
          .redirect(loginUrl)
      }
    })
  }

  @Get('callback/identity-server')
  async callback(
    @Query('code') code: string,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    this.logger.debug('Received callback request')

    const { redirectRoute } = req.cookies[REDIRECT_COOKIE_NAME] ?? {}
    const codeVerifier = req.cookies[this.codeVerifierCookie.name]
    res.clearCookie(
      this.codeVerifierCookie.name,
      this.codeVerifierCookie.options,
    )

    try {
      const idsTokens = await this.authService.fetchIdsToken(code, codeVerifier)
      const verifiedUserToken = await this.authService.verifyIdsToken(
        idsTokens.id_token,
      )

      if (verifiedUserToken) {
        this.logger.debug('Token verification successful')

        return this.redirectAuthenticatedUser(
          {
            nationalId: verifiedUserToken.nationalId,
          },
          res,
          redirectRoute,
          idsTokens.id_token,
          new Entropy({ bits: 128 }).string(),
        )
      }
    } catch (error) {
      this.logger.error('Authentication callback failed:', { error })
    }

    return res.redirect('/?villa=innskraning-ogild')
  }

  @Get('callback')
  async deprecatedAuth(@Res() res: Response) {
    this.logger.debug(
      'Received login request through a deprecated authentication system',
    )

    res.redirect('/?villa=innskraning-gomul')
  }

  @Get('logout')
  logout(@Res() res: Response, @Req() req: Request) {
    this.logger.debug('Received logout request')

    const idToken = req.cookies[this.idToken.name]

    res.clearCookie(this.accessTokenCookie.name, this.accessTokenCookie.options)
    res.clearCookie(this.csrfCookie.name, this.csrfCookie.options)
    res.clearCookie(
      this.codeVerifierCookie.name,
      this.codeVerifierCookie.options,
    )
    res.clearCookie(this.idToken.name, this.idToken.options)

    if (idToken) {
      return res.redirect(
        `${this.config.issuer}/connect/endsession?id_token_hint=${idToken}&post_logout_redirect_uri=${this.config.logoutRedirectUri}`,
      )
    }

    return res.redirect(this.config.logoutRedirectUri)
  }

  private async authorizeUser(
    authUser: AuthUser,
    csrfToken: string | undefined,
    requestedRedirectRoute: string,
    loginBypass: boolean,
  ) {
    let authorization:
      | {
          userId: string
          jwtToken: string
          redirectRoute: string
        }
      | undefined

    const users = await this.authService.findUsersByNationalId(
      authUser.nationalId,
    )
    let user = users && users.length > 0 ? users[0] : undefined

    if (users && user) {
      authorization = {
        userId: user.id,
        jwtToken: this.sharedAuthService.signJwt(0, users, csrfToken),
        redirectRoute:
          requestedRedirectRoute && requestedRedirectRoute.startsWith('/') // Guard against invalid redirects
            ? requestedRedirectRoute
            : user.role === UserRole.ADMIN
            ? USERS_ROUTE
            : user.role === UserRole.DEFENDER
            ? DEFENDER_CASES_ROUTE
            : user.institution?.type === InstitutionType.COURT_OF_APPEALS
            ? COURT_OF_APPEAL_CASES_ROUTE
            : isPrisonSystemUser(user)
            ? PRISON_CASES_ROUTE
            : CASES_ROUTE,
      }
    } else {
      user = await this.authService.findDefender(authUser.nationalId)

      if (user) {
        authorization = {
          userId: user.id,
          jwtToken: this.sharedAuthService.signJwt(0, [user], csrfToken),
          redirectRoute: requestedRedirectRoute ?? DEFENDER_CASES_ROUTE,
        }
      }
    }

    if (authorization) {
      this.backendService.createEventLog({
        eventType: loginBypass ? EventType.LOGIN_BYPASS : EventType.LOGIN,
        nationalId: user?.nationalId,
        userRole: user?.role,
        userName: user?.name,
        userTitle: user?.title,
        institutionName: user?.institution?.name,
      })

      return authorization
    }

    this.backendService.createEventLog({
      eventType: loginBypass
        ? EventType.LOGIN_BYPASS_UNAUTHORIZED
        : EventType.LOGIN_UNAUTHORIZED,
      nationalId: authUser.nationalId,
    })

    return undefined
  }

  private async redirectAuthenticatedUser(
    authUser: AuthUser,
    res: Response,
    requestedRedirectRoute: string,
    idToken?: string,
    csrfToken?: string,
  ) {
    const authorization = await this.authorizeUser(
      authUser,
      csrfToken,
      requestedRedirectRoute,
      !idToken,
    )

    if (!authorization) {
      this.logger.info('Blocking login attempt from an unauthorized user')

      return res.redirect('/?villa=innskraning-ekki-notandi')
    }

    const { userId, jwtToken, redirectRoute } = authorization

    this.auditTrailService.audit(
      userId,
      AuditedAction.LOGIN,
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
        .cookie(this.idToken.name, idToken, {
          ...this.idToken.options,
          maxAge: EXPIRES_IN_MILLISECONDS,
        })
        .redirect(redirectRoute),
      userId,
    )
  }
}
