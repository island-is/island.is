import jwt from 'jsonwebtoken'
import IslandisLogin from 'islandis-login'
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
import { ApiTags, ApiQuery } from '@nestjs/swagger'

import { Logger, LOGGER_PROVIDER } from '@island.is/logging'
import {
  CSRF_COOKIE_NAME,
  ACCESS_TOKEN_COOKIE_NAME,
} from '@island.is/judicial-system/consts'

import { environment } from '../../../environments'
import { Cookie, Credentials, VerifyResult, AuthUser } from './auth.types'
import { AuthService } from './auth.service'

const { samlEntryPoint, jwtSecret } = environment.auth

export const JWT_EXPIRES_IN_SECONDS = 4 * 60 * 60
export const ONE_HOUR = 60 * 60 * 1000
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
@ApiTags('authentication')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
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
      return res.redirect('/?error=true')
    }

    const { authId, returnUrl } = req.cookies[REDIRECT_COOKIE_NAME] || {}
    const { user } = verifyResult
    if (!user || (authId && user.authId !== authId)) {
      this.logger.error('Could not verify user authenticity', {
        extra: {
          authId,
          userAuthId: user?.authId,
        },
      })
      return res.redirect('/?error=true')
    }

    return this.redirectAuthenticatedUser(
      {
        nationalId: user.kennitala,
        name: user.fullname,
        mobile: user.mobile,
      },
      returnUrl ?? '/gaesluvardhaldskrofur',
      res,
      new Entropy({ bits: 128 }).string(),
    )
  }

  @Get('login')
  @ApiQuery({ name: 'returnUrl' })
  login(
    @Res() res: Response,
    @Query('returnUrl') returnUrl: string,
    @Query('nationalId') nationalId: string,
  ) {
    this.logger.debug(`Received login request with return url ${returnUrl}`)

    const { name, options } = REDIRECT_COOKIE

    res.clearCookie(name, options)

    // Local development
    if (environment.auth.allowAuthBypass && nationalId) {
      this.logger.debug(`Logging in as ${nationalId} in development mode`)
      return this.redirectAuthenticatedUser(
        {
          nationalId,
          name: '',
          mobile: '',
        },
        returnUrl ?? '/gaesluvardhaldskrofur',
        res,
      )
    }

    const authId = uuid()
    const electronicIdOnly = '&qaa=4'

    return res
      .cookie(name, { authId, returnUrl }, { ...options, maxAge: ONE_HOUR })
      .redirect(`${samlEntryPoint}&authId=${authId}${electronicIdOnly}`)
  }

  @Get('logout')
  logout(@Res() res: Response) {
    this.logger.debug('Received logout request')

    res.clearCookie(ACCESS_TOKEN_COOKIE.name, ACCESS_TOKEN_COOKIE.options)
    res.clearCookie(CSRF_COOKIE.name, CSRF_COOKIE.options)

    return res.json({ logout: true })
  }

  private async redirectAuthenticatedUser(
    authUser: AuthUser,
    returnUrl: string,
    res: Response,
    csrfToken?: string,
  ) {
    const valid = await this.authService.validateUser(authUser)

    if (!valid) {
      this.logger.error('Unknown user', {
        extra: {
          authUser,
        },
      })
      return res.redirect('/?error=true')
    }

    const jwtToken = jwt.sign(
      {
        user: authUser,
        csrfToken,
      } as Credentials,
      jwtSecret,
      { expiresIn: JWT_EXPIRES_IN_SECONDS },
    )

    const tokenParts = jwtToken.split('.')
    if (tokenParts.length !== 3) {
      return res.redirect('/error=true')
    }

    const maxAge = JWT_EXPIRES_IN_SECONDS * 1000
    return res
      .cookie(
        CSRF_COOKIE.name,
        csrfToken as string,
        {
          ...CSRF_COOKIE.options,
          maxAge,
        } as CookieOptions,
      )
      .cookie(ACCESS_TOKEN_COOKIE.name, jwtToken, {
        ...ACCESS_TOKEN_COOKIE.options,
        maxAge,
      })
      .redirect(returnUrl)
  }
}
