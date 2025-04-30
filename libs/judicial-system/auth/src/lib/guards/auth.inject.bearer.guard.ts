import { decode } from 'jsonwebtoken'

import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

import { AuthUser } from '../auth.types'
import { cookieExtractor } from '../cookieExtractor'

@Injectable()
export class JwtInjectBearerAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest()

    const cookie = cookieExtractor(req)

    if (cookie) {
      const decodedCookie = decode(cookie)

      if (decodedCookie && !(typeof decodedCookie === 'string')) {
        const csrfToken = decodedCookie['csrfToken']

        if (csrfToken) {
          req.headers['authorization'] = `Bearer ${csrfToken}`
        }
      }
    }

    return super.canActivate(context)
  }

  handleRequest<TUser extends AuthUser>(err: Error, user?: TUser): TUser {
    if (err || !user?.currentUser) {
      throw new UnauthorizedException(err?.message ?? 'Unauthorized')
    }

    return user
  }
}
