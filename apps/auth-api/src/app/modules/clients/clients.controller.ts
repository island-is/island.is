import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  UseGuards,
  Req,
  Inject,
  Logger,
} from '@nestjs/common'
import { ApiOkResponse, ApiTags, ApiOAuth2 } from '@nestjs/swagger'
import { Client } from './client.model';
import { ClientsService } from './clients.service'
import { AuthGuard } from '@nestjs/passport'
import { LOGGER_PROVIDER } from '@island.is/logging';

@ApiOAuth2(['@identityserver.api/read'])
//@UseGuards(AuthGuard('jwt'))
@ApiTags('clients')
@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService,
    @Inject(LOGGER_PROVIDER)
    private logger: Logger) {}

  @Get(':clientId')
  @ApiOkResponse({ type: Client })
  async findOne(@Param('clientId') clientId: string, @Req() request: Request): Promise<Client> {
    const clientProfile = await this.clientsService.findClientById(clientId)
    console.log(request.headers)
    if (!clientProfile) {
      throw new NotFoundException("This client doesn't exist")
    }

    return clientProfile
  }

}
