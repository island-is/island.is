import {
  Controller,
  Get,
  NotFoundException,
  Param,
  UseGuards,
  Req,
  Logger,
  Post,
  Body,
  BadRequestException,
} from '@nestjs/common'
import { ApiOkResponse, ApiTags, ApiOAuth2, ApiCreatedResponse } from '@nestjs/swagger'
import { Client } from './models/client.model'
import { ClientsService } from './clients.service'
import { AuthGuard } from '@nestjs/passport'

// @ApiOAuth2(['@identityserver.api/read'])
// @UseGuards(AuthGuard('jwt'))
@ApiTags('clients')
@Controller('clients')
export class ClientsController {
  constructor(
    private readonly clientsService: ClientsService,
  ) {}
  
  
  @Get(':clientId')
  @ApiOkResponse({ type: Client })
  async findOne(
    @Param('clientId') clientId: string
  ): Promise<Client> {
    const clientProfile = await this.clientsService.findClientById(clientId)
    if (!clientProfile) {
      throw new NotFoundException("This client doesn't exist")
    }

    return clientProfile
  }

  @Post()
  @ApiCreatedResponse({ type: Client })
  async create(@Body() client: Client): Promise<Client> {
    return await this.clientsService.createAsync(client)
  }
}
