import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common'
import { ApiSecurity, ApiTags } from '@nestjs/swagger'

import {
  AdminScopeService,
  AdminScopeDTO,
  MeTenantGuard,
  ClientCreateScopeDTO,
} from '@island.is/auth-api-lib'
import { IdsUserGuard, Scopes, ScopesGuard } from '@island.is/auth-nest-tools'
import { idsAdminScopes } from '@island.is/auth/scopes'
import { Audit } from '@island.is/nest/audit'
import { Documentation } from '@island.is/nest/swagger'

const namespace = '@island.is/auth/admin-api/v2/scopes'

@UseGuards(IdsUserGuard, ScopesGuard, MeTenantGuard)
@Scopes(...idsAdminScopes)
@ApiSecurity('ias', idsAdminScopes)
@ApiTags('admin')
@Controller({
  path: 'me/tenants/:tenantId/scopes',
  version: ['2'],
})
@Audit({ namespace })
export class MeScopesController {
  constructor(private readonly adminScopeService: AdminScopeService) {}

  @Get()
  @Documentation({
    description: 'Get all scopes by tenant id.',
    response: { status: 200, type: [AdminScopeDTO] },
  })
  @Audit<AdminScopeDTO[]>({
    resources: (scopes) => scopes.map((scope) => scope.name),
  })
  findAll(@Param('tenantId') id: string): Promise<AdminScopeDTO[]> {
    return this.adminScopeService.findApiScopesByTenantId(id)
  }

  @Get(':scopeName')
  @Documentation({
    description: 'Get scope by name and tenant id.',
    response: { status: 200, type: AdminScopeDTO },
  })
  @Audit<AdminScopeDTO>({
    resources: (scope) => scope.name,
  })
  findByName(
    @Param('tenantId') tenantId: string,
    @Param('scopeName') scopeName: string,
  ): Promise<AdminScopeDTO> {
    return this.adminScopeService.findApiScope({
      name: scopeName,
      tenantId,
    })
  }

  @Post()
  @Documentation({
    description: 'Creates api scope for specific tenant.',
    response: { status: 200, type: AdminScopeDTO },
  })
  @Audit<AdminScopeDTO>({
    resources: (scope) => scope.name,
  })
  create(
    @Param('tenantId') tenantId: string,
    @Body() input: ClientCreateScopeDTO,
  ): Promise<AdminScopeDTO> {
    return this.adminScopeService.createScope(tenantId, input)
  }
}
