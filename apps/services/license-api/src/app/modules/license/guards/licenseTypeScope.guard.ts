import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Observable } from 'rxjs'
import { Reflector } from '@nestjs/core'
import { getRequest } from '@island.is/auth-nest-tools'
import { LicenseApiScope, getLicenseTypeScopes } from '@island.is/auth/scopes'
import { licenseTypeToScope } from '../scopeMapper'
import { LicenseId } from '../license.types'

@Injectable()
export class LicenseTypeScopesGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = getRequest(context)

    const licenseId = request.params.licenseId
    const isVerify = licenseId === 'verify'

    if (!licenseId) {
      return false
    }

    const scopes = isVerify
      ? [LicenseApiScope.licensesVerify]
      : getLicenseTypeScopes()

    const authScope = request.auth?.scope

    if (scopes && !this.hasScope(scopes, authScope)) {
      return false
    }

    return !!authScope?.includes(
      isVerify
        ? LicenseApiScope.licensesVerify
        : licenseTypeToScope[licenseId as LicenseId],
    )
  }

  private hasScope(needScopes: string[], haveScopes: string[] = []): boolean {
    return needScopes.some((scope) => haveScopes.includes(scope))
  }
}
