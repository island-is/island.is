import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { AuthGuard } from '@nestjs/passport'
import { BYPASS_AUTH_KEY } from './bypass-auth.decorator'
import { getRequest } from './getRequest'
import { User } from './user'

@Injectable()
export class IdsUserGuard extends AuthGuard('jwt') {
  getRequest = getRequest
  constructor(private readonly reflector: Reflector) {
    super()
  }

  handleRequest<TUser extends User>(
    error: unknown,
    user: TUser,
    info: unknown,
    context: ExecutionContext,
    status?: unknown,
  ) {
    // Throws if there is an error or missing user.
    console.log(
      'WWWWWWWWWWWWWWW--handleRequest start-super--WWWWWWWWWWWWWWWWWWWW',
    )
    super.handleRequest(error, user, info, context, status)
    console.log(
      'WWWWWWWWWWWWWWW--handleRequest end-super--WWWWWWWWWWWWWWWWWWWW',
    )

    // Check if there's a nationalId claim for an authenticated user.
    if (!user.nationalId) {
      console.log('WWWWWWWWWWWWWWW--EXCEPTION--WWWWWWWWWWWWWWWWWWWW')
      throw new UnauthorizedException()
    }

    // AuthGuard saves user in request.user. We'll also save it as request.auth.
    const request = this.getRequest(context)
    request.auth = user
    console.log('WWWWWWWWWWWWWWWW--return-user-start--WWWWWWWWWWWWWWWWWWWW')
    console.log(JSON.stringify(user))
    console.log('WWWWWWWWWWWWWWWW--return-user-end--WWWWWWWWWWWWWWWWWWWW')
    return user
  }

  canActivate(context: ExecutionContext) {
    // we check for metadata set by the bypass auth decorator
    console.log('WWWWWWWWWWWWWWWWW--can-activate-1.0--WWWWWWWWWWWWWWWWWWWWW')
    const bypassAuth = this.reflector.getAllAndOverride<boolean>(
      BYPASS_AUTH_KEY,
      [context.getHandler(), context.getClass()],
    )

    // if the bypass auth exists and is truthy we bypass auth
    if (bypassAuth) {
      console.log('WWWWWWWWWWWWWWWWW--bypass-auth--WWWWWWWWWWWWWWWWWWWWW')
      return true
    }
    console.log('WWWWWWWWWWWWWWWWW--return-val-start--WWWWWWWWWWWWWWWWWWWWW-')
    const canActv = super.canActivate(context)
    console.log(JSON.stringify(canActv))
    if (!canActv) {
      console.log('NO canactivate...')
    } else {
      console.log('YES canactivate...')
    }
    console.log('WWWWWWWWWWWWWWWWW--return-val-end--WWWWWWWWWWWWWWWWWWWWW-')
    // pass auth checking to JWT auth guard
    // return super.canActivate(context)
    return canActv //Unauthorized villa þó bearer ok.
    // return true // virkar 1x server fer síðan á villu.
    // return false //forbidden resource
  }
}
