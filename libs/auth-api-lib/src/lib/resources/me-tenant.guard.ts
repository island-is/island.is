import { getRequest } from '@island.is/auth-nest-tools'
import { NoContentException } from '@island.is/nest/problem'
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common'

import { TenantsService } from './tenants.service'

@Injectable()
export class MeTenantGuard implements CanActivate {
  constructor(private tenantsService: TenantsService) {}

  async canActivate(context: ExecutionContext) {
    const request = getRequest(context)
    const user = request.user
    const { tenantId } = request.params

    if (!tenantId || !user) {
      throw new InternalServerErrorException(
        'Missing tenantId param or user auth',
      )
    }

    const hasAccess = await this.tenantsService.hasAccessToTenant(
      user,
      tenantId,
    )

    if (!hasAccess) {
      // Should not leak information about the existence of a tenant.
      throw new NoContentException()
    }
    return true
  }
}
