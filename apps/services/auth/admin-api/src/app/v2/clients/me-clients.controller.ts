import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
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
    private readonly clientsService: AdminClientsService,
    private readonly auditService: AuditService,
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
        meta: {
          fields: Object.keys(input),
        },
      },
      this.clientsService.update(user, tenantId, clientId, input),
    )
  }
}
