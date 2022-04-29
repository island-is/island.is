import IslandisLogin, { VerifyResult } from '@island.is/login'
import { Entropy } from 'entropy-string'
import { uuid } from 'uuidv4'
import { CookieOptions, Request, Response } from 'express'

import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Res,
  Query,
  Req,
} from '@nestjs/common'

import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import {
  CSRF_COOKIE_NAME,
  ACCESS_TOKEN_COOKIE_NAME,
  EXPIRES_IN_MILLISECONDS,
} from '@island.is/judicial-system/consts'
import { UserRole } from '@island.is/judicial-system/types'
import { SharedAuthService } from '@island.is/judicial-system/auth'
import {
  AuditedAction,
  AuditTrailService,
} from '@island.is/judicial-system/audit-trail'

import { environment } from '../../../environments'
import { AuthUser, Cookie } from './auth.types'
import { AuthService } from './auth.service'

const { samlEntryPoint } = environment.auth

const REDIRECT_COOKIE_NAME = 'judicial-system.redirect'

const defaultCookieOptions: CookieOptions = {
  secure: environment.production,
  httpOnly: true,
  sameSite: 'lax',
}

const CSRF_COOKIE: Cookie = {
  name: CSRF_COOKIE_NAME,
  options: {
    ...defaultCookieOptions,
    httpOnly: false,
  },
}

const ACCESS_TOKEN_COOKIE: Cookie = {
  name: ACCESS_TOKEN_COOKIE_NAME,
  options: defaultCookieOptions,
}

const REDIRECT_COOKIE: Cookie = {
  name: REDIRECT_COOKIE_NAME,
  options: {
    ...defaultCookieOptions,
    sameSite: 'none',
  },
}

@Controller('api/auth')
export class AuthController {
  constructor(
    private readonly auditTrailService: AuditTrailService,
    private readonly authService: AuthService,
    private readonly sharedAuthService: SharedAuthService,
    @Inject('IslandisLogin')
    private readonly loginIS: IslandisLogin,
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
  ) {}

  @Post('callback')
  async callback(
    @Body('token') token: string,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    this.logger.debug('Received callback request')

    let verifyResult: VerifyResult
    try {
      verifyResult = await this.loginIS.verify(token)
    } catch (err) {
      this.logger.error(err)

      return res.redirect('/?villa=innskraning-ogild')
    }

    const { authId, redirectRoute } = req.cookies[REDIRECT_COOKIE_NAME] ?? {}

    const { user } = verifyResult
    if (!user || (authId && user.authId !== authId)) {
      this.logger.error('Could not verify user authenticity', {
        extra: {
          authId,
          userAuthId: user?.authId,
        },
      })

      return res.redirect('/?villa=innskraning-ogild')
    }

    return this.redirectAuthenticatedUser(
      {
        nationalId: user.kennitala,
        name: user.fullname,
        mobile: user.mobile,
      },
      res,
      redirectRoute,
      new Entropy({ bits: 128 }).string(),
    )
  }

  @Get('login')
  login(
    @Res() res: Response,
    @Query('redirectRoute') redirectRoute: string,
    @Query('nationalId') nationalId: string,
  ) {
    this.logger.debug('Received login request')

    const { name, options } = REDIRECT_COOKIE

    res.clearCookie(name, options)

    // Local development
    if (environment.auth.allowAuthBypass && nationalId) {
      this.logger.debug(`Logging in using development mode`)

      return this.redirectAuthenticatedUser(
        {
          nationalId,
        },
        res,
        redirectRoute,
      )
    }

    const authId = uuid()
    const electronicIdOnly = '&qaa=4'

    return res
      .cookie(name, { authId, redirectRoute }, options)
      .redirect(`${samlEntryPoint}&authId=${authId}${electronicIdOnly}`)
  }

  @Get('logout')
  logout(@Res() res: Response) {
    this.logger.debug('Received logout request')

    res.clearCookie(ACCESS_TOKEN_COOKIE.name, ACCESS_TOKEN_COOKIE.options)
    res.clearCookie(CSRF_COOKIE.name, CSRF_COOKIE.options)

    return res.json({ logout: true })
  }

  private async authorizeUser(
    authUser: AuthUser,
    csrfToken: string | undefined,
    requestedRedirectRoute: string,
  ) {
    const user = await this.authService.findUser(authUser.nationalId)

    let userId: string | undefined
    let jwtToken: string | undefined
    let redirectRoute: string | undefined

    if (user && this.authService.validateUser(user)) {
      userId = user.id
      jwtToken = this.sharedAuthService.signJwt(user, csrfToken)
      redirectRoute = requestedRedirectRoute
        ? requestedRedirectRoute
        : user.role === UserRole.ADMIN
        ? '/notendur'
        : '/krofur'
    } else if (requestedRedirectRoute?.startsWith('/verjandi/')) {
      const defender = await this.authService.findDefender(
        requestedRedirectRoute.slice(10),
        authUser.nationalId,
      )

      if (defender && this.authService.validateUser(defender)) {
        userId = defender.id
        jwtToken = this.sharedAuthService.signJwt(defender, csrfToken)
        redirectRoute = requestedRedirectRoute
      }
    }

    return { userId, jwtToken, redirectRoute }
  }

  private async redirectAuthenticatedUser(
    authUser: AuthUser,
    res: Response,
    requestedRedirectRoute: string,
    csrfToken?: string,
  ) {
    const { userId, jwtToken, redirectRoute } = await this.authorizeUser(
      authUser,
      csrfToken,
      requestedRedirectRoute,
    )

    if (!userId || !jwtToken || !redirectRoute) {
      this.logger.error('Blocking login attempt from an unauthorized user')

      return res.redirect('/?villa=innskraning-ekki-notandi')
    }

    this.auditTrailService.audit(
      userId,
      AuditedAction.LOGIN,
      res
        .cookie(
          CSRF_COOKIE.name,
          csrfToken as string,
          {
            ...CSRF_COOKIE.options,
            maxAge: EXPIRES_IN_MILLISECONDS,
          } as CookieOptions,
        )
        .cookie(ACCESS_TOKEN_COOKIE.name, jwtToken, {
          ...ACCESS_TOKEN_COOKIE.options,
          maxAge: EXPIRES_IN_MILLISECONDS,
        })
        .redirect(redirectRoute),
      userId,
    )
  }
}
