import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Observable } from 'rxjs'
import { Reflector } from '@nestjs/core'
import { getRequest } from './getRequest'
import { SCOPES_KEY, ACTOR_SCOPES_KEY } from './scopes.decorator'

@Injectable()
export class ScopesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const scopes = this.reflector.getAllAndOverride<string[]>(SCOPES_KEY, [
      context.getHandler(),
      context.getClass(),
    ])

    const actorScopes = this.reflector.getAllAndOverride<string[]>(
      ACTOR_SCOPES_KEY,
      [context.getHandler(), context.getClass()],
    )
    const request = getRequest(context)

    if (scopes && !this.hasScope(scopes, request.auth?.scope)) {
      return false
    }

    if (
      actorScopes &&
      !this.hasScope(
        actorScopes,
        request.user?.actor ? request.user.actor.scope : request.user?.scope,
      )
    ) {
      return false
    }

    return true
  }

  private hasScope(needScopes: string[], haveScopes: string[] = []): boolean {
    return needScopes.some((scope) => haveScopes.includes(scope))
  }
}
