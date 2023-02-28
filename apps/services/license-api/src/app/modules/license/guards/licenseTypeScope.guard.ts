import { SCOPES_KEY, getRequest } from '@island.is/auth-nest-tools'
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Observable } from 'rxjs'
import { Reflector } from '@nestjs/core'

@Injectable()
export class LicenseTypeScopeGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const scopes = this.reflector.getAllAndOverride<string[]>(SCOPES_KEY, [
      context.getHandler(),
      context.getClass(),
    ])

    const req = getRequest(context)

    if (scopes && !this.hasScope(scopes, req.auth?.scope)) {
      return false
    }

    const licenseType = this.getLicenseTypeFromUrl(req.url)
    const scopeActions = this.getScopeActions(req.auth?.scope ?? [])

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
