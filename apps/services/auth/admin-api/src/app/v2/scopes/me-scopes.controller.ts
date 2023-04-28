import { Controller, Get, Param, UseGuards } from '@nestjs/common'
import { ApiSecurity, ApiTags } from '@nestjs/swagger'

import {
  AdminScopeService,
  AdminScopeDto,
  MeTenantGuard,
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
    response: { status: 200, type: [AdminScopeDto] },
  })
  @Audit<AdminScopeDto[]>({
    resources: (scopes) => scopes.map((scope) => scope.name),
  })
  findAll(@Param('tenantId') id: string): Promise<AdminScopeDto[]> {
    return this.adminScopeService.findApiScopesByTenantId(id)
  }
}
