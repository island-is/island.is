import { Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common'
import { ApiSecurity, ApiTags } from '@nestjs/swagger'

import { MeTenantGuard } from '@island.is/auth-api-lib'
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

import { ClientSecretsService } from './client-secrets.service'
import { ClientSecretDto } from './dto/client-secret.dto'

const namespace = '@island.is/auth/admin-api/v2/clients'

@UseGuards(IdsUserGuard, ScopesGuard, MeTenantGuard)
@Scopes(...idsAdminScopes)
@ApiSecurity('ias', idsAdminScopes)
@ApiTags('admin')
@Controller({
  path: 'me/tenants/:tenantId/clients/:clientId/secrets',
  version: ['2'],
})
@Audit({ namespace })
export class MeClientSecretsController {
  constructor(
    private readonly clientSecretsService: ClientSecretsService,
    private readonly auditService: AuditService,
  ) {}

  @Get()
  @Documentation({
    description: 'Get all client secrets for the specified client and tenant.',
    response: { status: 200, type: [ClientSecretDto] },
  })
  @Audit<ClientSecretDto[]>({
    resources: (secrets) => secrets.map((secret) => secret.secretId),
  })
  findAll(
    @CurrentUser() user: User,
    @Param('tenantId') tenantId: string,
    @Param('clientId') clientId: string,
  ): Promise<ClientSecretDto[]> {
    return this.clientSecretsService.findAll(tenantId, clientId)
  }

  @Post()
  @Documentation({
    description:
      'Create a new client secret for the specified tenant and client.',
    response: { status: 201, type: ClientSecretDto },
  })
  @Audit<ClientSecretDto>({
    resources: (secret) => secret.secretId,
    alsoLog: true,
  })
  create(
    @CurrentUser() user: User,
    @Param('tenantId') tenantId: string,
    @Param('clientId') clientId: string,
  ): Promise<ClientSecretDto> {
    return this.clientSecretsService.create(tenantId, clientId)
  }

  @Delete(':secretId')
  @Documentation({
    description: 'Delete a client secret for the specified tenant and client.',
    response: { status: 204 },
  })
  async delete(
    @CurrentUser() user: User,
    @Param('tenantId') tenantId: string,
    @Param('clientId') clientId: string,
    @Param('secretId') secretId: string,
  ): Promise<void> {
    await this.auditService.auditPromise(
      {
        auth: user,
        namespace,
        action: 'delete',
        resources: secretId,
        alsoLog: true,
        meta: (deleted) => ({
          deleted,
        }),
      },
      this.clientSecretsService.delete(tenantId, clientId, secretId),
    )
  }
}
