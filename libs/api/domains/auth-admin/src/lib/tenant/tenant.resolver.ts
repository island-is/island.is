import { UseGuards } from '@nestjs/common'
import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql'

import type { User } from '@island.is/auth-nest-tools'
import { CurrentUser, IdsUserGuard } from '@island.is/auth-nest-tools'
import { Environment } from '@island.is/shared/types'

import { TenantsPayload } from './dto/tenants.payload'
import { Tenant } from './models/tenant.model'
import { TenantsService } from './tenants.service'
import { TenantEnvironment } from './models/tenant-environment.model'

@UseGuards(IdsUserGuard)
@Resolver(() => Tenant)
export class TenantResolver {
  constructor(private readonly tenantsService: TenantsService) {}

  @Query(() => Tenant, { name: 'authAdminTenant' })
  getTenant(@Args('id') id: string, @CurrentUser() user: User) {
    return this.tenantsService.getTenantById(id, user)
  }

  @Query(() => TenantsPayload, { name: 'authAdminTenants' })
  getTenants(@CurrentUser() user: User) {
    return this.tenantsService.getTenants(user)
  }

  @ResolveField('defaultEnvironment', () => TenantEnvironment)
  resolveDefaultEnvironment(@Parent() tenant: Tenant): TenantEnvironment {
    if (tenant.environments.length === 0) {
      throw new Error(`Tenant ${tenant.id} has no environments`)
    }

    // Depends on the priority order being decided by the backend
    return tenant.environments[0]
  }

  @ResolveField('availableEnvironments', () => [Environment])
  resolveAvailableEnvironments(@Parent() tenant: Tenant): Environment[] {
    return tenant.environments.map((env) => env.environment)
  }
}
