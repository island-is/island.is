import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  Delete,
} from '@nestjs/common'
import { ApiSecurity, ApiTags } from '@nestjs/swagger'

import {
  AdminClientDto,
  AdminClientsService,
  AdminCreateClientDto,
  AdminPatchClientDto,
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
import { Audit, AuditService } from '@island.is/nest/audit'
import { Documentation } from '@island.is/nest/swagger'

import { ClientSecretsService } from '../secrets/client-secrets.service'

const namespace = '@island.is/auth/admin-api/v2/clients'

@UseGuards(IdsUserGuard, ScopesGuard, MeTenantGuard)
@Scopes(...idsAdminScopes)
@ApiSecurity('ias', idsAdminScopes)
@ApiTags('admin')
@Controller({
  path: 'me/tenants/:tenantId/clients',
  version: ['2'],
})
@Audit({ namespace })
export class MeClientsController {
  constructor(
    private readonly auditService: AuditService,
    private readonly clientsService: AdminClientsService,
    private readonly clientsSecretsService: ClientSecretsService,
  ) {}

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
  findByTenantIdAndClientId(
    @CurrentUser() user: User,
    @Param('tenantId') tenantId: string,
    @Param('clientId') clientId: string,
    @Param('includeArchived') includeArchived?: boolean,
  ): Promise<AdminClientDto> {
    return this.clientsService.findByTenantIdAndClientId(
      tenantId,
      clientId,
      includeArchived,
    )
  }

  @Post()
  @Documentation({
    description: 'Create a new client for the specified tenant.',
    response: { status: 201, type: AdminClientDto },
  })
  @Audit<AdminClientDto>({
    resources: (client) => client.clientId,
    alsoLog: true,
  })
  async create(
    @CurrentUser() user: User,
    @Param('tenantId') tenantId: string,
    @Body() input: AdminCreateClientDto,
  ): Promise<AdminClientDto> {
    const client = await this.clientsService.create(input, user, tenantId)

    await this.clientsSecretsService.create(tenantId, client.clientId)

    return client
  }

  @Patch(':clientId')
  @Documentation({
    description: 'Update a client with partial set of properties.',
    response: { status: 200, type: AdminClientDto },
  })
  update(
    @CurrentUser() user: User,
    @Param('tenantId') tenantId: string,
    @Param('clientId') clientId: string,
    @Body() input: AdminPatchClientDto,
  ): Promise<AdminClientDto> {
    return this.auditService.auditPromise<AdminClientDto>(
      {
        namespace,
        auth: user,
        action: 'update',
        resources: (client) => client.clientId,
        alsoLog: true,
        meta: {
          fields: Object.keys(input),
        },
      },
      this.clientsService.update(user, tenantId, clientId, input),
    )
  }

  @Delete(':clientId')
  @Documentation({
    description: 'Delete a client.',
    response: { status: 204 },
  })
  async delete(
    @CurrentUser() user: User,
    @Param('clientId') clientId: string,
    @Param('tenantId') tenantId: string,
  ): Promise<void> {
    return this.auditService.auditPromise(
      {
        auth: user,
        namespace,
        action: 'delete',
        resources: clientId,
        alsoLog: true,
        meta: { tenantId },
      },
      this.clientsService.delete(clientId, tenantId),
    )
  }
}
