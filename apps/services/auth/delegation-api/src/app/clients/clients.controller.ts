import { Controller, Get, Query, UseGuards } from '@nestjs/common'
import { ApiSecurity, ApiTags } from '@nestjs/swagger'

import { ClientsService } from '@island.is/auth-api-lib'
import { IdsUserGuard, Scopes, ScopesGuard } from '@island.is/auth-nest-tools'
import { AuthScope } from '@island.is/auth/scopes'
import { Audit } from '@island.is/nest/audit'
import { Documentation } from '@island.is/nest/swagger'

import { ClientDto } from './client.dto'

@UseGuards(IdsUserGuard, ScopesGuard)
@Scopes(AuthScope.delegations)
@ApiSecurity('ias', [AuthScope.delegations])
@ApiTags('/clients')
@Controller({
  path: 'clients',
  version: ['1'],
})
@Audit({ namespace: '@island.is/auth/delegation-api/clients' })
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Get()
  @Documentation({
    response: { status: 200, type: [ClientDto] },
    request: {
      query: {
        lang: {
          description: 'The language to return the client name in.',
          required: false,
          type: 'string',
        },
        clientId: {
          description: 'List of clientIds to filter by.',
          required: false,
          isArray: true,
          type: 'string',
        },
      },
    },
  })
  @Audit<ClientDto[]>({
    resources: (clients) => clients.map((client) => client.clientId),
  })
  async findAll(
    @Query('lang') lang?: string,
    @Query('clientId')
    clientIds?: string[],
  ): Promise<ClientDto[]> {
    const clients = await this.clientsService.findAllWithTranslation(
      clientIds,
      lang,
    )

    if (!clients) {
      return []
    }

    return clients.map((client) => {
      // While we have clients without the domainName property set we have a fallback to parse it from the clientId
      const domainName = client.domainName || client.clientId.split('/')[0]

      return {
        clientId: client.clientId,
        clientName: client.clientName ?? client.clientId,
        domainName,
      }
    })
  }
}
