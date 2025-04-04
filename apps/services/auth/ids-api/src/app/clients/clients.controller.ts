import { Client, ClientsService } from '@island.is/auth-api-lib'
import { IdsAuthGuard, Scopes, ScopesGuard } from '@island.is/auth-nest-tools'
import {
  BadRequestException,
  Controller,
  Get,
  NotFoundException,
  Param,
  UseGuards,
  VERSION_NEUTRAL,
} from '@nestjs/common'
import { ApiOkResponse, ApiTags } from '@nestjs/swagger'

@UseGuards(IdsAuthGuard, ScopesGuard)
@ApiTags('clients')
@Controller({
  path: 'clients',
  version: ['1', VERSION_NEUTRAL],
})
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  /** Gets a client by id  */
  @Scopes('@identityserver.api/authentication')
  @Get(':id')
  @ApiOkResponse({ type: Client })
  async findOne(@Param('id') id: string): Promise<Client> {
    const dummy = 8
    if (!id) {
      throw new BadRequestException('Id must be provided')
    }

    const clientProfile = await this.clientsService.findClientById(id)

    if (!clientProfile) {
      throw new NotFoundException("This client doesn't exist")
    }

    return clientProfile
  }
}
