import IslandisLogin, { VerifyResult } from 'islandis-login'
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

import { Logger, LOGGER_PROVIDER } from '@island.is/logging'

import {
  User,
  ACCESS_TOKEN_COOKIE_NAME,
  COOKIE_EXPIRES_IN_MILLISECONDS,
  CSRF_COOKIE_NAME,
} from '@island.is/financial-aid/shared'

import { SharedAuthService } from '@island.is/financial-aid/auth'

import { environment } from '../../../environments'
import { Cookie } from './auth.types'
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
    private readonly authService: AuthService,
    private readonly sharedAuthService: SharedAuthService,
    @Inject('IslandisLogin')
    private readonly loginIS: IslandisLogin,
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
  ) {}

  @Get('login')
  login(
    @Res() res: Response,
    @Query('returnUrl') returnUrl: string,
    @Query('nationalId') nationalId: string,
  ) {
    this.logger.debug(`Received login request with return url ${returnUrl}`)

    // Local development
    if (environment.auth.allowAuthBypass && nationalId) {
      this.logger.debug(`Logging in as ${nationalId} in development mode`)

      const fakeUser = this.authService.fakeUser(nationalId)

      if (fakeUser) {
        return this.logInUser(fakeUser, res, returnUrl || '/umsokn')
      }
    }
    res.clearCookie(REDIRECT_COOKIE.name, REDIRECT_COOKIE.options)

    const authId = uuid()
    const electronicIdOnly = '&qaa=4'

    return res
      .cookie(
        REDIRECT_COOKIE.name,
        { authId, returnUrl },
        { ...REDIRECT_COOKIE.options, maxAge: COOKIE_EXPIRES_IN_MILLISECONDS },
      )
      .redirect(`${samlEntryPoint}&authId=${authId}${electronicIdOnly}`)
  }

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

    const { user: islandUser } = verifyResult

    const { authId, returnUrl } = req.cookies[REDIRECT_COOKIE_NAME] || {}

    if (!islandUser || (authId && islandUser.authId !== authId)) {
      this.logger.error('Could not verify user authenticity', {
        extra: {
          authId,
          userAuthId: islandUser?.authId,
        },
      })

      return res.redirect('/?villa=innskraning-ogild')
    }

    const user: User = {
      nationalId: islandUser.kennitala,
      name: islandUser.fullname,
      phoneNumber: islandUser.mobile,
    }

    return this.logInUser(user, res, returnUrl)
  }

  @Get('logout')
  logout(@Res() res: Response) {
    this.logger.debug('Received logout request')

    res.clearCookie(ACCESS_TOKEN_COOKIE.name, ACCESS_TOKEN_COOKIE.options)
    res.clearCookie(CSRF_COOKIE.name, CSRF_COOKIE.options)

    return res.json({ logout: true })
  }

  private logInUser(user: User, res: Response, returnUrl: string) {
    const csrfToken = new Entropy({ bits: 128 }).string()

    const jwtToken = this.sharedAuthService.signJwt(user, csrfToken)

    res
      .cookie(CSRF_COOKIE.name, csrfToken, {
        ...CSRF_COOKIE.options,
        maxAge: COOKIE_EXPIRES_IN_MILLISECONDS,
      } as CookieOptions)
      .cookie(ACCESS_TOKEN_COOKIE.name, jwtToken, {
        ...ACCESS_TOKEN_COOKIE.options,
        maxAge: COOKIE_EXPIRES_IN_MILLISECONDS,
      })
      .redirect(returnUrl)
  }
}
