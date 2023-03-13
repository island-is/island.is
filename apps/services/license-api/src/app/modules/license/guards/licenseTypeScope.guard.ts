import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Observable } from 'rxjs'
import { getRequest } from '@island.is/auth-nest-tools'
import { licenseTypeToScope } from '../scopeMapper'
import { LicenseId } from '../license.types'

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
