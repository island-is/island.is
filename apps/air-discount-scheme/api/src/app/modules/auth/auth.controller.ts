import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Query,
  Req,
  Res,
} from '@nestjs/common'
import jwt from 'jsonwebtoken'
import { uuid } from 'uuidv4'
import { Entropy } from 'entropy-string'
import IslandisLogin from 'islandis-login'

import { Logger, LOGGER_PROVIDER } from '@island.is/logging'
import {
  CSRF_COOKIE_NAME,
  ACCESS_TOKEN_COOKIE_NAME,
} from '@island.is/air-discount-scheme/consts'
import { environment } from '../../../environments'
import { Cookie, CookieOptions, Credentials, VerifyResult } from './auth.types'

const { samlEntryPoint, audience: audienceUrl, jwtSecret } = environment.auth

const JWT_EXPIRES_IN_SECONDS = 1800
const ONE_HOUR = 60 * 60 * 1000
const REDIRECT_COOKIE_NAME = 'ads.redirect'

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

const loginIS = new IslandisLogin({
  audienceUrl,
})

@Controller('/api/auth')
export class AuthController {
  constructor(@Inject(LOGGER_PROVIDER) private logger: Logger) {}

  @Post('/callback')
  async callback(@Body('token') token, @Res() res, @Req() req) {
    let verifyResult: VerifyResult
    try {
      verifyResult = await loginIS.verify(token)
    } catch (err) {
      this.logger.error(err)
      return res.redirect('/error')
    }

    const { authId, returnUrl } = req.cookies[REDIRECT_COOKIE_NAME] || {}
    const { user } = verifyResult
    if (!user || (authId && user.authId !== authId)) {
      this.logger.error('Could not verify user authenticity', {
        extra: {
          user,
        },
      })
      return res.redirect('/error')
    }

    const csrfToken = new Entropy({ bits: 128 }).string()
    const jwtToken = jwt.sign(
      {
        user: {
          nationalId: user.kennitala,
          name: user.fullname,
          mobile: user.mobile,
        },
        csrfToken,
      } as Credentials,
      jwtSecret,
      { expiresIn: JWT_EXPIRES_IN_SECONDS },
    )

    const tokenParts = jwtToken.split('.')
    if (tokenParts.length !== 3) {
      return res.redirect('/error')
    }

    const maxAge = JWT_EXPIRES_IN_SECONDS * 1000
    return res
      .cookie(CSRF_COOKIE.name, csrfToken, {
        ...CSRF_COOKIE.options,
        maxAge,
      })
      .cookie(ACCESS_TOKEN_COOKIE.name, jwtToken, {
        ...ACCESS_TOKEN_COOKIE.options,
        maxAge,
      })
      .redirect(returnUrl ?? '/_')
  }

  @Get('/login')
  login(@Res() res, @Query() query) {
    const { returnUrl } = query
    const { name, options } = REDIRECT_COOKIE
    res.clearCookie(name, options)
    const authId = uuid()

    return res
      .cookie(name, { authId, returnUrl }, { ...options, maxAge: ONE_HOUR })
      .redirect(samlEntryPoint)
  }

  @Get('/logout')
  logout(@Res() res) {
    res.clearCookie(ACCESS_TOKEN_COOKIE.name, ACCESS_TOKEN_COOKIE.options)
    res.clearCookie(CSRF_COOKIE.name, CSRF_COOKIE.options)
    return res.json({ logout: true })
  }
}
