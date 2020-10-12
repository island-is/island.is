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
import { Entropy } from 'entropy-string'
import * as kennitala from 'kennitala'
import IslandisLogin from 'islandis-login'

import { Logger, LOGGER_PROVIDER } from '@island.is/logging'
import {
  CSRF_COOKIE_NAME,
  ACCESS_TOKEN_COOKIE_NAME,
  SSN_IS_NOT_A_PERSON,
} from '@island.is/skilavottord/consts'
import { environment } from '../../../environments'
import { Cookie, CookieOptions, Credentials, VerifyResult } from './auth.types'

const { samlEntryPoint, audience: audienceUrl, jwtSecret } = environment.auth

const JWT_EXPIRES_IN_SECONDS = 3600
const ONE_HOUR = 60 * 60 * 1000
const REDIRECT_COOKIE_NAME = 'skilavottord.redirect'

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

@Controller('/api/auth/citizen')
export class AuthController {
  constructor(@Inject(LOGGER_PROVIDER) private logger: Logger) {}

  @Post('/callback')
  async callback(@Body('token') token, @Res() res, @Req() req) {
    //console.log("Duddi ralli rai")
    let verifyResult: VerifyResult
    try {
      verifyResult = await loginIS.verify(token)
    } catch (err) {
      this.logger.error(err)
      //console.log("Duddi ralli rai - error")
      return res.redirect('/error')
    }

    const { returnUrl } = req.cookies[REDIRECT_COOKIE_NAME] || {}
    const { user } = verifyResult
    if (!user) {
      this.logger.error('Could not verify user authenticity')
      //console.log("Duddi ralli rai - error 2")
      return res.redirect('/error')
    }

    if (!kennitala.isPerson(user.kennitala)) {
      this.logger.warn('User used company kennitala to log in')
      return res.redirect(`/error?errorType=${SSN_IS_NOT_A_PERSON}`)
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
    this.logger.error('---user---')
    this.logger.error(user)
    this.logger.error('---csrfToken---')
    this.logger.error(csrfToken)
    this.logger.error('---jwtToken---')
    this.logger.error(jwtToken)
    this.logger.error('---CSRF_COOKIE---')
    this.logger.error(CSRF_COOKIE)
    this.logger.error('---ACCESS_TOKEN_COOKIE---')
    this.logger.error(ACCESS_TOKEN_COOKIE)
    this.logger.error('---returnUrl---')
    this.logger.error(returnUrl)
    //    console.log("---user---")
    //    console.log(user)
    //    console.log("---csrfToken---")
    //    console.log(csrfToken)
    //    console.log("---jwtToken---")
    //    console.log(jwtToken)
    //    console.log("---CSRF_COOKIE---")
    //    console.log(CSRF_COOKIE)
    //    console.log("---ACCESS_TOKEN_COOKIE---")
    //    console.log(ACCESS_TOKEN_COOKIE)
    //    console.log("---returnUrl---")
    //    console.log(returnUrl)
    //    console.log("---res---")
    //    console.log(res)
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
    this.logger.error('---/login starting---')
    const { returnUrl } = query
    const { name, options } = REDIRECT_COOKIE
    res.clearCookie(name, options)
    this.logger.error('---returnUrl---')
    this.logger.error(returnUrl)
    this.logger.error('---samlEntryPoint---')
    this.logger.error(samlEntryPoint)
    return res
      .cookie(name, { returnUrl }, { ...options, maxAge: ONE_HOUR })
      .redirect(samlEntryPoint)
  }

  @Get('/logout')
  logout(@Res() res) {
    res.clearCookie(ACCESS_TOKEN_COOKIE.name, ACCESS_TOKEN_COOKIE.options)
    res.clearCookie(CSRF_COOKIE.name, CSRF_COOKIE.options)
    return res.json({ logout: true })
  }
}
