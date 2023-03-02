import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Observable } from 'rxjs'
import { Reflector } from '@nestjs/core'
import { SCOPES_KEY, getRequest } from '@island.is/auth-nest-tools'

@Injectable()
export class LicenseTypeScopesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const scopes = this.reflector.getAllAndOverride<string[]>(SCOPES_KEY, [
      context.getHandler(),
      context.getClass(),
    ])

    const request = getRequest(context)

    if (scopes && !this.hasScope(scopes, request.auth?.scope)) {
      return false
    }

    const licenseType = this.getLicenseTypeFromUrl(request.url)
    const scopeActions = this.getScopeActions(request.auth?.scope ?? [])

    return scopeActions.includes(licenseType)
  }

  private hasScope(needScopes: string[], haveScopes: string[] = []): boolean {
    return needScopes.some((scope) => haveScopes.includes(scope))
  }

  private getScopeActions(scopes: string[]): string[] {
    return scopes.map((s) => s.split(':')[1])
  }

  private getLicenseTypeFromUrl = (url: string) =>
    url.substring(url.lastIndexOf('/') + 1)
}
