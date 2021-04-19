import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Observable } from 'rxjs'
import { Reflector } from '@nestjs/core'
import { getRequest } from "./getRequest";

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

    const authScopes = this.getScopes(context)

    const hasPermission = () =>
      allowedScopes.every((scope) => authScopes.includes(scope))

    return hasPermission()
  }

  private getScopes(context: ExecutionContext): string[] {
    const request = getRequest(context)
    return request.auth.scope
  }
}
