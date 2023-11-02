import { Controller, Get, Param, UseGuards } from '@nestjs/common'
import { ApiSecurity, ApiTags } from '@nestjs/swagger'

import {
  MeTenantGuard,
  AdminClientsService,
  AdminScopeDTO,
} from '@island.is/auth-api-lib'
import { IdsUserGuard, Scopes, ScopesGuard } from '@island.is/auth-nest-tools'
import { idsAdminScopes } from '@island.is/auth/scopes'
import { Audit } from '@island.is/nest/audit'
import { Documentation } from '@island.is/nest/swagger'

const namespace = '@island.is/auth/admin-api/v2/client/scopes'

@UseGuards(IdsUserGuard, ScopesGuard, MeTenantGuard)
@Scopes(...idsAdminScopes)
@ApiSecurity('ias', idsAdminScopes)
@ApiTags('admin')
@Controller({
  path: 'me/tenants/:tenantId/clients/:clientId/scopes',
  version: ['2'],
})
@Audit({ namespace })
export class MeClientsScopesController {
  constructor(private readonly adminClientsService: AdminClientsService) {}

  @Get()
  @Documentation({
    description: 'Gets all allowed scopes for the specified client and tenant.',
    response: { status: 200, type: [AdminScopeDTO] },
  })
  @Audit<AdminScopeDTO[]>({
    resources: (scopes) => scopes.map((scope) => scope.name),
  })
  findAll(
    @Param('tenantId') tenantId: string,
    @Param('clientId') clientId: string,
  ): Promise<AdminScopeDTO[]> {
    return this.adminClientsService.findAllowedScopes({
      tenantId,
      clientId,
    })
  }
}
