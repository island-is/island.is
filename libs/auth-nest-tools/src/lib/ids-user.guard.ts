import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { getRequest } from './getRequest'
import { User } from './user'

@Injectable()
export class IdsUserGuard extends AuthGuard('jwt') {
  getRequest = getRequest

  handleRequest<TUser extends User>(
    error: unknown,
    user: TUser,
    info: unknown,
    context: ExecutionContext,
    status?: unknown,
  ) {
    // Throws if there is an error or missing user.
    super.handleRequest(error, user, info, context, status)

    // Check if there's a nationalId claim for an authenticated user.
    if (!user.nationalId) {
      throw new UnauthorizedException()
    }

    // AuthGuard saves user in request.user. We'll also save it as request.auth.
    const request = this.getRequest(context)
    request.auth = user
    return user
  }
}
