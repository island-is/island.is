import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { AuthUser } from './auth.types'

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context)
  }

  handleRequest<TUser extends AuthUser>(err: Error, user: TUser): TUser {
    if (err || !user) {
      throw err || new UnauthorizedException()
    }
    return user
  }
}
