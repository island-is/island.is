import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Observable } from 'rxjs'
import { Reflector } from '@nestjs/core'

@Injectable()
export class ScopesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const allowedScopes = this.reflector.get<string[]>(
      'scopes',
      context.getHandler(),
    )

    if (!allowedScopes) {
      return false
    }

    const userScopes = context.getArgs()[0].user.scope

    const hasPermission = () =>
      allowedScopes.every((scope) => userScopes.includes(scope))

    return hasPermission()
  }
}
