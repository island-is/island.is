import jwt from 'jsonwebtoken'

import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'
import { AuthGuard } from '@nestjs/passport'

import { AuthUser } from '../auth.types'

const hasTokenExpired = (token: string) => {
  const decodedToken = jwt.decode(token, { complete: true })
  if (decodedToken && typeof decodedToken === 'object') {
    const payload = decodedToken.payload
    if (payload && 'exp' in payload) {
      const expiredTimestamp = payload['exp']
      const currentTime = Math.floor(Date.now() / 1000)
      return expiredTimestamp < currentTime
    }
  }
  return false
}

// TEMPT
@Injectable()
export class JwtRefreshTokenGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context)
    const req = ctx.getContext().req
    console.log(req.c)

    const accessToken = req.cookies['judicial-system.ids.access_token']
    
    if (hasTokenExpired(accessToken)) {
      console.log('YES')
      // here we need to call our api auth service to refresh the tokens and update the cookie
      // but we shouldn't add that depedency here.
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
