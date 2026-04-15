import { Controller, Get, Param, UseGuards } from '@nestjs/common'
import { ApiSecurity, ApiTags } from '@nestjs/swagger'

import {
  MeTenantGuard,
  AdminScopeService,
  AdminScopeClientDto,
} from '@island.is/auth-api-lib'
import { IdsUserGuard, Scopes, ScopesGuard } from '@island.is/auth-nest-tools'
import { idsAdminScopes } from '@island.is/auth/scopes'
import { Audit } from '@island.is/nest/audit'
import { Documentation } from '@island.is/nest/swagger'

const namespace = '@island.is/auth/admin-api/v2/scopes/clients'

@UseGuards(IdsUserGuard, ScopesGuard, MeTenantGuard)
@Scopes(...idsAdminScopes)
@ApiSecurity('ias', idsAdminScopes)
@ApiTags('admin')
@Controller({
  path: 'me/tenants/:tenantId/scopes/:scopeName/clients',
  version: ['2'],
})
@Audit({ namespace })
export class MeScopeClientsController {
  constructor(private readonly adminScopeService: AdminScopeService) {}

  @Get()
  @Documentation({
    description:
      'Gets all clients that use the specified scope within the tenant.',
    response: { status: 200, type: [AdminScopeClientDto] },
  })
  @Audit<AdminScopeClientDto[]>({
    resources: (clients) => clients.map((client) => client.clientId),
  })
  findAll(
    @Param('tenantId') tenantId: string,
    @Param('scopeName') scopeName: string,
  ): Promise<AdminScopeClientDto[]> {
    return this.adminScopeService.findClientsByScopeName({
      tenantId,
      scopeName,
    })
  }
}
