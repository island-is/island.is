import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common'
import { ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { Client } from './client.model';
import { ClientsService } from './clients.service'

@ApiTags('clients')
@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Get(':clientId')
  @ApiOkResponse({ type: Client })
  async findOne(@Param('clientId') clientId: string): Promise<Client> {
    const clientProfile = await this.clientsService.findClientById(clientId)

    if (!clientProfile) {
      throw new NotFoundException("This client doesn't exist")
    }

    return clientProfile
  }

}
