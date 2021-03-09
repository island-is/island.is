import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Observable } from 'rxjs'
import { GqlExecutionContext } from '@nestjs/graphql'
import { AccessService } from '@island.is/auth-api-lib'

@Injectable()
export class FullAdminAccessGuard implements CanActivate {
  private readonly ACCESSGUARDSCOPE = 'auth-admin-api.full_control'

  constructor(private readonly accessService: AccessService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.getArgs()[0]

    const scopes: string[] = request.user.scope
    if (scopes.includes(this.ACCESSGUARDSCOPE)) {
      return true
    }

    return false
  }
}
