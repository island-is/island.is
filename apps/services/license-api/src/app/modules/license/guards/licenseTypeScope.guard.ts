import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Observable } from 'rxjs'
import { getRequest } from '@island.is/auth-nest-tools'
import { licenseTypeToScope } from '../scopeMapper'
import { LicenseId } from '../license.types'

/**
 * Checks that the access token has the required scopes to be able to perform an action on a specific `LicenseId`
 */
@Injectable()
export class LicenseTypeScopesGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = getRequest(context)

    const licenseId = request.params.licenseId
    if (!licenseId) {
      return false
    }

    const authScope = request.auth?.scope

    return !!authScope?.includes(licenseTypeToScope[licenseId as LicenseId])
  }
}
