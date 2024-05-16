import {
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest<TUser = any>(
    err: any,
    user: any,
    info: any,
    context: any,
    status?: any,
  ): TUser {
    console.log('user', user)
    return user
  }
}
