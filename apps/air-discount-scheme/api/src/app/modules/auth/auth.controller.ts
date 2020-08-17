import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Redirect,
  Req,
  Res,
  Inject,
} from '@nestjs/common'
import { uuid } from 'uuidv4'
import jwt from 'jsonwebtoken'
import { Entropy } from 'entropy-string'
import IslandisLogin from 'islandis-login'

import { Logger, LOGGER_PROVIDER } from '@island.is/logging'
import { environment } from '../../../environments'
import { Cookie, CookieOptions, Credentials, VerifyResult } from './auth.types'

const { samlEntryPoint, audience: audienceUrl, jwtSecret } = environment.auth

export const JWT_EXPIRES_IN_SECONDS = 1800

export const ONE_HOUR = 60 * 60 * 1000

const defaultCookieOptions: CookieOptions = {
  secure: environment.production,
  httpOnly: true,
  sameSite: 'lax',
}

export const REDIRECT_COOKIE: Cookie = {
  name: 'gjafakort.redirect',
  options: {
    ...defaultCookieOptions,
    sameSite: 'none',
  },
}

export const CSRF_COOKIE: Cookie = {
  name: 'gjafakort.csrf',
  options: {
    ...defaultCookieOptions,
    httpOnly: false,
  },
}

export const ACCESS_TOKEN_COOKIE: Cookie = {
  name: 'gjafakort.token',
  options: defaultCookieOptions,
}

const loginIS = new IslandisLogin({
  audienceUrl,
})

@Controller('/api/auth')
export class AuthController {
  constructor(@Inject(LOGGER_PROVIDER) private logger: Logger) {}

  @Post('/callback')
  @Redirect('/', 302)
  async callback(@Body('token') token, @Res() res, @Req() req) {
    let verifyResult: VerifyResult
    try {
      verifyResult = await loginIS.verify(token)
    } catch (err) {
      this.logger.error(err)
      return { url: '/error' }
    }

    const { user } = verifyResult
    const redirectCookie = req.cookies[REDIRECT_COOKIE.name]
    res.clearCookie(REDIRECT_COOKIE.name, REDIRECT_COOKIE.options)
    if (!redirectCookie) {
      this.logger.error('Redirect cookie not sent', {
        extra: {
          user,
        },
      })
      return { url: '/api/auth/login' }
    }

    const { authId, returnUrl } = redirectCookie
    if (!user || authId !== user?.authId) {
      this.logger.error('Could not verify user authenticity', {
        extra: {
          user,
          authId,
          returnUrl,
        },
      })
      return { url: '/error' }
    }

    const csrfToken = new Entropy({ bits: 128 }).string()
    const jwtToken = jwt.sign(
      {
        user: { ssn: user.kennitala, name: user.fullname, mobile: user.mobile },
        csrfToken,
      } as Credentials,
      jwtSecret,
      { expiresIn: JWT_EXPIRES_IN_SECONDS },
    )

    const tokenParts = jwtToken.split('.')
    if (tokenParts.length !== 3) {
      return { url: '/error' }
    }

    const maxAge = JWT_EXPIRES_IN_SECONDS * 1000
    res
      .cookie(CSRF_COOKIE.name, csrfToken, {
        ...CSRF_COOKIE.options,
        maxAge,
      })
      .cookie(ACCESS_TOKEN_COOKIE.name, jwtToken, {
        ...ACCESS_TOKEN_COOKIE.options,
        maxAge,
      })
    return { url: !returnUrl || returnUrl.charAt(0) !== '/' ? '/' : returnUrl }
  }

  @Get('/login')
  login(@Query('returnUrl') returnUrl: string, @Res() res) {
    const { name, options } = REDIRECT_COOKIE
    res.clearCookie(name, options)
    const authId = uuid()

    res.cookie(name, { authId, returnUrl }, { ...options, maxAge: ONE_HOUR })
    return res.redirect(`${samlEntryPoint}&authId=${authId}`)
  }

  @Get('/logout')
  logout(@Res() res) {
    res.clearCookie(ACCESS_TOKEN_COOKIE.name, ACCESS_TOKEN_COOKIE.options)
    res.clearCookie(CSRF_COOKIE.name, CSRF_COOKIE.options)
    return res.json({ logout: true })
  }
}
