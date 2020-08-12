import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
  Res,
} from '@nestjs/common'
import { uuid } from 'uuidv4'
import jwt from 'jsonwebtoken'
import { Entropy } from 'entropy-string'
import IslandisLogin from 'islandis-login'
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger'

import { environment } from '../../../environments'
import { Auth } from './auth.model'
import { AuthService } from './auth.service'
import { Cookie, CookieOptions, LogoutResponse } from './types'
import { AuthDto } from './dto/auth.dto'

export const JWT_EXPIRES_IN_SECONDS = 1800

export const ONE_HOUR = 60 * 60 * 1000

const defaultCookieOptions: CookieOptions = {
  secure: environment.production,
  httpOnly: true,
  sameSite: 'lax',
}

export const REDIRECT_COOKIE: Cookie = {
  name: REDIRECT_COOKIE_NAME,
  options: {
    ...defaultCookieOptions,
    sameSite: 'none',
  },
}

export const CSRF_COOKIE: Cookie = {
  name: CSRF_COOKIE_NAME,
  options: {
    ...defaultCookieOptions,
    httpOnly: false,
  },
}

export const ACCESS_TOKEN_COOKIE: Cookie = {
  name: ACCESS_TOKEN_COOKIE_NAME,
  options: defaultCookieOptions,
}

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/callback')
  callback(@Body token: string, @Res res: Response) {
    let verifyResult: VerifyResult
    try {
      verifyResult = await loginIS.verify(token)
    } catch (err) {
      logger.error(err)
      return res.redirect('/error')
    }

    const { user } = verifyResult
    const redirectCookie = req.cookies[REDIRECT_COOKIE.name]
    res.clearCookie(REDIRECT_COOKIE.name, REDIRECT_COOKIE.options)
    if (!redirectCookie) {
      logger.error('Redirect cookie not sent', {
        extra: {
          user,
        },
      })
      return res.redirect('/api/auth/login')
    }

    const { authId, returnUrl } = redirectCookie
    if (!user || authId !== user?.authId) {
      logger.error('Could not verify user authenticity', {
        extra: {
          user,
          authId,
          returnUrl,
        },
      })
      return res.redirect('/error')
    }

    if (!kennitala.isPerson(user.kennitala)) {
      logger.warn('User used company kennitala to log in')
      return res.redirect(`/error?errorType=${SSN_IS_NOT_A_PERSON}`)
    }

    const yearBorn = new Date(
      kennitala.info(user.kennitala).birthday,
    ).getFullYear()
    if (yearBorn > YEAR_BORN_LIMIT) {
      logger.warn(`User born after ${YEAR_BORN_LIMIT} logged in`)
      return res.redirect(`/error?errorType=${USER_NOT_OLD_ENOUGH}`)
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
      .redirect(!returnUrl || returnUrl.charAt(0) !== '/' ? '/' : returnUrl)
  }

  @Get('/login')
  login(@Query returnUrl: string) {
    const { name, options } = REDIRECT_COOKIE
    res.clearCookie(name, options)
    const authId = uuid()

    return res
      .cookie(name, { authId, returnUrl }, { ...options, maxAge: ONE_HOUR })
      .redirect(`${samlEntryPoint}&authId=${authId}`)
  }

  @Get('/logout')
  @ApiOkResponse({ type: LogoutResponse })
  logout(@Res res: Response): Promise<LogoutResponse> {
    res.clearCookie(ACCESS_TOKEN_COOKIE.name, ACCESS_TOKEN_COOKIE.options)
    res.clearCookie(CSRF_COOKIE.name, CSRF_COOKIE.options)
    return res.json({ logout: true })
  }
}
