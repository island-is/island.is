import { UseGuards } from '@nestjs/common'
import { Parent, Query, ResolveField, Resolver } from '@nestjs/graphql'

import { IdsUserGuard } from '@island.is/auth-nest-tools'

import { TenantsPayload } from './dto/tenants.payload'
import { Tenant } from './models/tenant.model'
import { TenantEnvironment } from './models/tenant-environment.model'
import { TenantsService } from './tenants.service'

@UseGuards(IdsUserGuard)
@Resolver(() => Tenant)
export class TenantResolver {
  constructor(private readonly tenantsService: TenantsService) {}

  @Query(() => TenantsPayload, { name: 'authAdminTenants' })
  getTenants() {
    return this.tenantsService.getTenants()
  }

  @ResolveField('defaultEnvironment', () => TenantEnvironment)
  resolveDefaultEnvironment(@Parent() tenant: Tenant): TenantEnvironment {
    if (tenant.environments.length === 0) {
      throw new Error(`Tenant ${tenant.id} has no environments`)
    }

    return {
      ...tenant.environments[0],
      id: `${tenant.environments[0].name}-merged`,
      applicationCount: Math.max(
        ...tenant.environments.map((t) => t.applicationCount),
      ),
      apiCount: Math.max(...tenant.environments.map((t) => t.apiCount)),
    }
  }
}
