import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common'
import { ApiSecurity, ApiTags } from '@nestjs/swagger'

import {
  AdminClientDto,
  AdminClientsService,
  AdminCreateClientDto,
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

@UseGuards(IdsUserGuard, ScopesGuard, MeTenantGuard)
@Scopes(...idsAdminScopes)
@ApiSecurity('ias', idsAdminScopes)
@ApiTags('admin')
@Controller({
  path: 'me/tenants/:tenantId/clients',
  version: ['2'],
})
@Audit({ namespace: '@island.is/auth/admin-api/v2/clients' })
export class MeClientsController {
  constructor(private readonly clientsService: AdminClientsService) {}

  @Get()
  @Documentation({
    description: 'Get all clients for the specified tenant.',
    response: { status: 200, type: [AdminClientDto] },
  })
  @Audit<AdminClientDto[]>({
    resources: (clients) => clients.map((client) => client.clientId),
  })
  findByTenantId(
    @Param('tenantId') tenantId: string,
  ): Promise<AdminClientDto[]> {
    return this.clientsService.findByTenantId(tenantId)
  }

  @Get(':clientId')
  @Documentation({
    description: 'Get client by id and tenant for the current user.',
    response: { status: 200, type: AdminClientDto },
  })
  @Audit<AdminClientDto>({
    resources: (client) => client.clientId,
  })
  findById(
    @CurrentUser() user: User,
    @Param('tenantId') tenantId: string,
    @Param('clientId') clientId: string,
  ): Promise<AdminClientDto> {
    return this.clientsService.findByTenantIdAndClientId(tenantId, clientId)
  }

  @Post()
  @Documentation({
    description: 'Create a new client for the specified tenant.',
    response: { status: 201, type: AdminClientDto },
  })
  @Audit<AdminClientDto>({
    resources: (client) => client.clientId,
  })
  create(
    @CurrentUser() user: User,
    @Param('tenantId') tenantId: string,
    @Body() input: AdminCreateClientDto,
  ): Promise<AdminClientDto> {
    return this.clientsService.create(input, user, tenantId)
  }
}
