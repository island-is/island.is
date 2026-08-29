import { Controller, Get, UseGuards } from '@nestjs/common'
import { ApiSecurity, ApiTags } from '@nestjs/swagger'

import {
  AdminClientListDto,
  AdminClientsService,
} from '@island.is/auth-api-lib'
import { IdsUserGuard, Scopes, ScopesGuard } from '@island.is/auth-nest-tools'
import { idsAdminScopes } from '@island.is/auth/scopes'
import { Audit } from '@island.is/nest/audit'
import { Documentation } from '@island.is/nest/swagger'

const namespace = '@island.is/auth/admin-api/v2/clients'

@UseGuards(IdsUserGuard, ScopesGuard)
@Scopes(...idsAdminScopes)
@ApiSecurity('ias', idsAdminScopes)
@ApiTags('admin')
@Controller({
  path: 'clients',
  version: ['2'],
})
@Audit({ namespace })
export class ClientsController {
  constructor(private readonly clientsService: AdminClientsService) {}

  @Get()
  @Documentation({
    description:
      'List all clients across tenants. Returns only the minimal data required to identify and label a client (id, tenant, type, display name).',
    response: { status: 200, type: [AdminClientListDto] },
  })
  @Audit<AdminClientListDto[]>({
    resources: (clients) => clients.map((client) => client.clientId),
  })
  findAll(): Promise<AdminClientListDto[]> {
    return this.clientsService.findAll()
  }
}
