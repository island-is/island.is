import { Controller, Get, Param, UseGuards } from '@nestjs/common'
import { ApiSecurity, ApiTags } from '@nestjs/swagger'

import {
  TenantDto,
  TenantsService,
  MeTenantGuard,
} from '@island.is/auth-api-lib'
import {
  CurrentUser,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
  User,
} from '@island.is/auth-nest-tools'
import { idsAdminScopes } from '@island.is/auth/scopes'
import { Audit } from '@island.is/nest/audit'
import { Documentation } from '@island.is/nest/swagger'

@UseGuards(IdsUserGuard, ScopesGuard)
@Scopes(...idsAdminScopes)
@ApiSecurity('ias', idsAdminScopes)
@ApiTags('admin')
@Controller({
  path: 'me/tenants',
  version: ['2'],
})
@Audit({ namespace: '@island.is/auth/admin-api/v2/tenants' })
export class MeTenantsController {
  constructor(private readonly tenantsService: TenantsService) {}

  @Get()
  @Documentation({
    description: 'Get all tenants for the current user.',
    response: { status: 200, type: [TenantDto] },
  })
  @Audit<TenantDto[]>({
    resources: (tenants) => tenants.map((tenant) => tenant.name),
  })
  findAll(@CurrentUser() user: User): Promise<TenantDto[]> {
    return this.tenantsService.findAllByUser(user)
  }

  @Get(':tenantId')
  @Documentation({
    description: 'Get tenant by id for the current user.',
    response: { status: 200, type: TenantDto },
  })
  @Audit<TenantDto>({
    resources: (tenant) => tenant.name,
  })
  @UseGuards(MeTenantGuard)
  findById(@Param('tenantId') tenantId: string): Promise<TenantDto> {
    return this.tenantsService.findById(tenantId)
  }
}
