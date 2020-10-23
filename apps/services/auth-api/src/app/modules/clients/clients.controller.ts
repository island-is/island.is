import {
  BadRequestException,
  Controller,
  Get,
  NotFoundException,
  Param,
  UseGuards,
} from '@nestjs/common'
import { ApiOkResponse, ApiTags } from '@nestjs/swagger'
import {
  Client,
  ClientsService,
  Scopes,
  ScopesGuard,
  IdsAuthGuard,
} from '@island.is/auth-api-lib'

// TODO: Add guards after getting communications to work properly with IDS4
// @UseGuards(IdsAuthGuard, ScopesGuard)
@ApiTags('clients')
@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  /** Gets a client by id */
  @Scopes('@identityserver.api/authentication')
  @Get(':id')
  @ApiOkResponse({ type: Client })
  async findOne(@Param('id') id: string): Promise<Client> {
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
