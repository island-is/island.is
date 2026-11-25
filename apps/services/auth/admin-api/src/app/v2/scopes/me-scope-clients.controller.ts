import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common'
import { ApiSecurity, ApiTags } from '@nestjs/swagger'

import {
  MeTenantGuard,
  AdminScopeService,
  AdminScopeClientDto,
} from '@island.is/auth-api-lib'
import {
  CurrentUser,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
  User,
} from '@island.is/auth-nest-tools'
import { idsAdminScopes } from '@island.is/auth/scopes'
import { Audit, AuditService } from '@island.is/nest/audit'
import { Documentation } from '@island.is/nest/swagger'

import { UpdateScopeClientsDto } from './dto/update-scope-clients.dto'

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
  constructor(
    private readonly auditService: AuditService,
    private readonly adminScopeService: AdminScopeService,
  ) {}

  @Get()
  @Documentation({
    description:
      'Gets all clients that use the specified scope. Includes clients from other tenants when they have been granted cross-domain access to the scope.',
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

  @Patch()
  @Documentation({
    description:
      'Update the client access list for a specific scope by adding/removing clients.',
    response: { status: 200 },
  })
  async updateScopeClients(
    @CurrentUser() user: User,
    @Param('tenantId') tenantId: string,
    @Param('scopeName') scopeName: string,
    @Body() input: UpdateScopeClientsDto,
  ): Promise<void> {
    await this.auditService.auditPromise(
      {
        namespace,
        auth: user,
        action: 'updateScopeClients',
        resources: scopeName,
        alsoLog: true,
        meta: {
          tenantId,
          added: input.addedClientIds,
          removed: input.removedClientIds,
        },
      },
      this.adminScopeService.updateScopeClients({
        tenantId,
        scopeName,
        addedClientIds: input.addedClientIds,
        removedClientIds: input.removedClientIds,
      }),
    )
  }
}
