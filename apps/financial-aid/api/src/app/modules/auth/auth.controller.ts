import IslandisLogin, { VerifyUser } from '@island.is/login'
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
  DefaultValuePipe,
} from '@nestjs/common'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

import {
  User,
  ACCESS_TOKEN_COOKIE_NAME,
  COOKIE_EXPIRES_IN_MILLISECONDS,
  CSRF_COOKIE_NAME,
  ReturnUrl,
  AllowedFakeUsers,
  RolesRule,
} from '@island.is/financial-aid/shared/lib'

import { SharedAuthService } from '@island.is/financial-aid/auth'

import { environment } from '../../../environments'
import { Cookie } from './auth.types'
import { AuthService } from './auth.service'

const { samlEntryPointOsk, samlEntryPointVeita } = environment.auth

const REDIRECT_COOKIE_NAME = 'financial-aid.redirect'

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

// TODO: REMOVE
@Controller('api/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly sharedAuthService: SharedAuthService,
    @Inject('IslandisLoginOsk')
    private readonly loginOsk: IslandisLogin,
    @Inject('IslandisLoginVeita')
    private readonly loginVeita: IslandisLogin,
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
  ) {}

  @Get('login')
  async login(
    @Res() res: Response,
    @Query('service', new DefaultValuePipe('osk')) service: 'osk' | 'veita',
    @Query('nationalId') nationalId: string,
  ) {
    this.logger.debug(`Received login request for the service ${service}`)

    // Local development
    if (
      environment.auth.allowFakeUsers &&
      nationalId &&
      AllowedFakeUsers.includes(nationalId)
    ) {
      this.logger.debug(`Logging in as ${nationalId} in development mode`)
      const fakeUser = this.authService.fakeUser(nationalId)

      if (fakeUser) {
        return this.logInUser(fakeUser, res)
      }
    }

    res.clearCookie(REDIRECT_COOKIE.name, REDIRECT_COOKIE.options)

    const authId = uuid()
    const electronicIdOnly = '&qaa=4'

    const samlEntryPoint =
      service === 'osk' ? samlEntryPointOsk : samlEntryPointVeita

    return res
      .cookie(
        REDIRECT_COOKIE.name,
        { authId, service },
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

    let islandUser: VerifyUser | undefined = undefined

    const { authId, service } = req.cookies[REDIRECT_COOKIE_NAME] || {}

    try {
      const verifyResult =
        service === 'osk'
          ? await this.loginOsk.verify(token)
          : await this.loginVeita.verify(token)

      if (verifyResult.user && verifyResult.user.authId === authId) {
        islandUser = verifyResult.user
      } else {
        this.logger.error('Could not verify user authenticity', {
          extra: {
            authId,
            userAuthId: verifyResult.user?.authId,
          },
        })
      }
    } catch (err) {
      this.logger.error(err)
    }

    if (!islandUser) {
      return res.redirect('/?villa=innskraning-ogild')
    }

    const user: User = {
      nationalId: islandUser.kennitala,
      name: islandUser.fullname,
      phoneNumber: islandUser.mobile,
      folder: uuid(),
      service: service,
      returnUrl: ReturnUrl.APPLICATION,
    }

    return this.logInUser(user, res)
  }

  @Get('logout')
  logout(@Res() res: Response) {
    this.logger.debug('Received logout request')

    res.clearCookie(ACCESS_TOKEN_COOKIE.name, ACCESS_TOKEN_COOKIE.options)
    res.clearCookie(CSRF_COOKIE.name, CSRF_COOKIE.options)

    return res.json({ logout: true })
  }

  getReturnUrl = (
    returnUrl: ReturnUrl,
    service: RolesRule,
    applicationId: string | undefined,
  ) => {
    switch (true) {
      case returnUrl === ReturnUrl.APPLICATION && applicationId !== undefined:
        return `${ReturnUrl.MYPAGE}/${applicationId}`
      case service === RolesRule.VEITA:
        return ReturnUrl.ADMIN
      default:
        return ReturnUrl.APPLICATION
    }
  }

  private logInUser(user: User, res: Response) {
    const csrfToken = new Entropy({ bits: 128 }).string()

    const jwtToken = this.sharedAuthService.signJwt(user, csrfToken)

    const returnUrl = this.getReturnUrl(
      user.returnUrl as ReturnUrl,
      res.req?.query.service as RolesRule,
      res.req?.query.applicationId as string,
    )

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
