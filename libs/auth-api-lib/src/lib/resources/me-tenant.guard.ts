import { getRequest } from '@island.is/auth-nest-tools'
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'

import { TenantsService } from './tenants.service'

@Injectable()
export class MeTenantGuard implements CanActivate {
  constructor(private tenantsService: TenantsService) {}

  async canActivate(context: ExecutionContext) {
    const request = getRequest(context)
    const user = request.user
    const { tenantId } = request.params

    if (!tenantId || !user) {
      console.warn('Missing tenantId param or user auth')
      return false
    }

    return this.tenantsService.hasAccessToTenant(user, tenantId)
  }
}
