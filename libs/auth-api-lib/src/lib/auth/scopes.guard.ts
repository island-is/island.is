import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Observable } from 'rxjs'
import { Reflector } from '@nestjs/core'
import { GqlExecutionContext } from '@nestjs/graphql'

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
      return true
    }

    const userScopes = this.getUserScopes(context)

    const hasPermission = () =>
      allowedScopes.every((scope) => userScopes.includes(scope))

    return hasPermission()
  }

  private getUserScopes(context: ExecutionContext): string[] {
    const request = context.getArgs()[0]
    if (request) {
      return request.user.scope
    } else {
      const ctx = GqlExecutionContext.create(context)
      return ctx.getContext().req.user.scope
    }
  }
}
