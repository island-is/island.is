import { UseGuards } from '@nestjs/common'
import { Query, Resolver } from '@nestjs/graphql'

import { IdsUserGuard } from '@island.is/auth-nest-tools'

import { TenantsPayload } from '../dto/tenants.payload'
import { Tenant } from '../models/tenant.model'
import { TenantsService } from '../services/tenants.service'

@UseGuards(IdsUserGuard)
@Resolver(() => Tenant)
export class TenantResolver {
  constructor(private readonly tenantsService: TenantsService) {}

  @Query(() => TenantsPayload, { name: 'authAdminTenants' })
  getTenants() {
    return this.tenantsService.getTenants()
  }
}
