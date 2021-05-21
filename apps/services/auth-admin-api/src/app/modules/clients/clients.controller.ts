import {
  Client,
  ClientDTO,
  ClientsService,
  ClientUpdateDTO,
  PagedRowsDto,
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
import {
  IdsUserGuard,
  ScopesGuard,
  Scopes,
  CurrentUser,
  User,
} from '@island.is/auth-nest-tools'
import { Scope } from '../access/scope.constants'
import { Audit, AuditService } from '@island.is/nest/audit'
import { environment } from '../../../environments/environment'

const namespace = `${environment.audit.defaultNamespace}/clients`

@UseGuards(IdsUserGuard, ScopesGuard)
@ApiTags('clients')
@Controller('backend/clients')
@Audit({ namespace })
export class ClientsController {
  constructor(
    private readonly clientsService: ClientsService,
    private readonly auditService: AuditService,
  ) {}

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
  @Audit<PagedRowsDto<Client>>({
    resources: (result) => result.rows.map((client) => client.clientId),
  })
  async findAndCountAll(
    @Query('searchString') searchString: string,
    @Query('page') page: number,
    @Query('count') count: number,
  ): Promise<PagedRowsDto<Client>> {
    if (searchString) {
      return this.clientsService.findClients(searchString, page, count)
    }

    return this.clientsService.findAndCountAll(page, count)
  }

  /** Gets client by id */
  @Scopes(Scope.root, Scope.full)
  @Get(':id')
  @ApiOkResponse({ type: Client })
  @Audit<Client>({
    resources: (client) => client?.clientId,
  })
  async findOne(@Param('id') id: string): Promise<Client> {
    if (!id) {
      throw new BadRequestException('Id must be provided')
    }

    return this.clientsService.findClientById(id)
  }

  /** Creates a new client */
  @Scopes(Scope.root, Scope.full)
  @Post()
  @ApiCreatedResponse({ type: Client })
  @Audit<Client>({
    resources: (client) => client.clientId,
  })
  async create(@Body() client: ClientDTO): Promise<Client> {
    return this.clientsService.create(client)
  }

  /** Updates an existing client */
  @Scopes(Scope.root, Scope.full)
  @Put(':id')
  @ApiCreatedResponse({ type: Client })
  async update(
    @Body() client: ClientUpdateDTO,
    @Param('id') id: string,
    @CurrentUser() user: User,
  ): Promise<Client> {
    if (!id) {
      throw new BadRequestException('Id must be provided')
    }

    return this.auditService.auditPromise(
      {
        user,
        action: 'update',
        namespace,
        resources: id,
        meta: { fields: Object.keys(client) },
      },
      this.clientsService.update(client, id),
    )
  }

  /** Soft deleting a client by Id */
  @Scopes(Scope.root, Scope.full)
  @Delete(':id')
  @ApiCreatedResponse()
  async delete(
    @Param('id') id: string,
    @CurrentUser() user: User,
  ): Promise<number> {
    if (!id) {
      throw new BadRequestException('Id must be provided')
    }

    return this.auditService.auditPromise(
      {
        user,
        action: 'delete',
        namespace,
        resources: id,
      },
      this.clientsService.delete(id),
    )
  }
}
