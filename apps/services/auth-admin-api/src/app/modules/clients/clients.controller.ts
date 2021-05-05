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
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common'
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger'
import { IdsUserGuard, ScopesGuard, Scopes } from '@island.is/auth-nest-tools'
import { Scope } from '../access/scope.constants'

@UseGuards(IdsUserGuard, ScopesGuard)
@ApiTags('clients')
@Controller('backend/clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  /** Gets all clients and count of rows */
  @Scopes(Scope.root, Scope.full)
  @Get()
  @ApiQuery({ name: 'searchString', required: false })
  @ApiQuery({ name: 'page', required: true })
  @ApiQuery({ name: 'count', required: true })
  @ApiOkResponse({
    schema: {
      allOf: [
        {
          properties: {
            count: {
              type: 'number',
              example: 1,
            },
            rows: {
              type: 'array',
              items: { $ref: getSchemaPath(Client) },
            },
          },
        },
      ],
    },
  })
  async findAndCountAll(
    @Query('searchString') searchString: string,
    @Query('page') page: number,
    @Query('count') count: number,
  ): Promise<{ rows: Client[]; count: number } | null> {
    if (searchString) {
      const clients = await this.clientsService.findClients(
        searchString,
        page,
        count,
      )
      return clients
    }

    const clients = await this.clientsService.findAndCountAll(page, count)
    return clients
  }

  /** Gets client by id */
  @Scopes(Scope.root, Scope.full)
  @Get(':id')
  @ApiOkResponse({ type: Client })
  async findOne(@Param('id') id: string): Promise<Client> {
    if (!id) {
      throw new BadRequestException('Id must be provided')
    }

    const clientProfile = await this.clientsService.findClientById(id)
    return clientProfile
  }

  /** Creates a new client */
  @Scopes(Scope.root, Scope.full)
  @Post()
  @ApiCreatedResponse({ type: Client })
  async create(@Body() client: ClientDTO): Promise<Client> {
    return await this.clientsService.create(client)
  }

  /** Updates an existing client */
  @Scopes(Scope.root, Scope.full)
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

  /** Soft deleting a client by Id */
  @Scopes(Scope.root, Scope.full)
  @Delete(':id')
  @ApiCreatedResponse()
  async delete(@Param('id') id: string): Promise<number> {
    if (!id) {
      throw new BadRequestException('Id must be provided')
    }

    return await this.clientsService.delete(id)
  }
}
