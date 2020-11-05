import {
  Client,
  ClientDTO,
  ClientsService,
  ClientUpdateDTO,
} from '@island.is/auth-api-lib'
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common'
import {
  ApiCreatedResponse,
  ApiOAuth2,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger'

@ApiOAuth2(['@identityserver.api/read'])
// TODO: ADD guards when functional
// @UseGuards(AuthGuard('jwt'))
@ApiTags('clients')
@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  /** Gets all clients and count of rows */
  @Get()
  @ApiQuery({ name: 'page', required: true })
  @ApiQuery({ name: 'count', required: true })
  async findAndCountAll(
    @Query('page') page: number,
    @Query('count') count: number,
  ): Promise<{ rows: Client[]; count: number } | null> {
    const clients = await this.clientsService.findAndCountAll(page, count)
    return clients
  }

  /** Gets client by id */
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

  /** Creates a new client */
  @Post()
  @ApiCreatedResponse({ type: Client })
  async create(@Body() client: ClientDTO): Promise<Client> {
    console.log(client)
    return await this.clientsService.create(client)
  }

  /** Updates an existing client */
  @Put(':id')
  @ApiCreatedResponse({ type: Client })
  async update(
    @Body() client: ClientUpdateDTO,
    @Param('id') id: string,
  ): Promise<Client | null> {
    if (!id) {
      throw new BadRequestException('Id must be provided')
    }

    return await this.clientsService.update(client, id)
  }

  /** Deletes a client by Id */
  @Delete(':id')
  @ApiCreatedResponse()
  async delete(@Param('id') id: string): Promise<number> {
    if (!id) {
      throw new BadRequestException('Id must be provided')
    }

    return await this.clientsService.delete(id)
  }
}
