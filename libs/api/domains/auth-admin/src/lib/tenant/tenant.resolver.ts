import { UseGuards } from '@nestjs/common'
import { Parent, Query, ResolveField, Resolver } from '@nestjs/graphql'

import { IdsUserGuard } from '@island.is/auth-nest-tools'

import { TenantsPayload } from './dto/tenants.payload'
import { Tenant } from './models/tenant.model'
import { TenantsService } from './tenants.service'
import { TenantMergedEnvironment } from './models/tenant-merged-environment.model'

@UseGuards(IdsUserGuard)
@Resolver(() => Tenant)
export class TenantResolver {
  constructor(private readonly tenantsService: TenantsService) {}

  @Query(() => TenantsPayload, { name: 'authAdminTenants' })
  getTenants() {
    return this.tenantsService.getTenants()
  }

  @ResolveField('mergedEnvironment', () => TenantMergedEnvironment)
  resolveDefaultEnvironment(@Parent() tenant: Tenant): TenantMergedEnvironment {
    if (tenant.environments.length === 0) {
      throw new Error(`Tenant ${tenant.id} has no environments`)
    }

    return {
      ...tenant.environments[0],
      environment: tenant.environments.map((t) => t.environment),
      applicationCount: Math.max(
        ...tenant.environments.map((t) => t.applicationCount),
      ),
      apiCount: Math.max(...tenant.environments.map((t) => t.apiCount)),
    }
  }
}
