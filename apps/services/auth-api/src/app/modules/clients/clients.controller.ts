import {
  Controller,
  Get,
  NotFoundException,
  Param,
  SetMetadata,
  UseGuards,
} from '@nestjs/common'
import { ApiOkResponse, ApiTags } from '@nestjs/swagger'
import {
  Client,
  ClientsService,
  Scopes,
  ScopesGuard,
} from '@island.is/auth-api-lib'
import { AuthGuard } from '@nestjs/passport'

@UseGuards(AuthGuard('jwt'), ScopesGuard)
@ApiTags('clients')
@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Scopes('@identityserver.api/authentication')
  @Get(':id')
  @ApiOkResponse({ type: Client })
  async findOne(@Param('id') id: string): Promise<Client> {
    const clientProfile = await this.clientsService.findClientById(id)

    if (!clientProfile) {
      throw new NotFoundException("This client doesn't exist")
    }

    return clientProfile
  }
}
