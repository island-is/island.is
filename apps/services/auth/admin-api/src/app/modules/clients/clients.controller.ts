import {
  Client,
  ClientDTO,
  ClientsService,
  ClientUpdateDTO,
  PagedRowsDto,
} from '@island.is/auth-api-lib'
import { NoContentException } from '@island.is/nest/problem'
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
  VERSION_NEUTRAL,
} from '@nestjs/common'
import {
  ApiCreatedResponse,
  ApiExcludeController,
  ApiOkResponse,
  ApiQuery,
  getSchemaPath,
} from '@nestjs/swagger'
import type { User } from '@island.is/auth-nest-tools'
import {
  IdsUserGuard,
  ScopesGuard,
  Scopes,
  CurrentUser,
} from '@island.is/auth-nest-tools'
import { AuthAdminScope } from '@island.is/auth/scopes'
import { Audit, AuditService } from '@island.is/nest/audit'
import { environment } from '../../../environments/'

const namespace = `@island.is/auth-admin-api/clients`

@UseGuards(IdsUserGuard, ScopesGuard)
@ApiExcludeController()
@Controller({ path: 'clients', version: [VERSION_NEUTRAL, '1'] })
@Audit({ namespace })
export class ClientsController {
  constructor(
    private readonly clientsService: ClientsService,
    private readonly auditService: AuditService,
  ) {}

  /** Gets all clients and count of rows */
  @Scopes(AuthAdminScope.root, AuthAdminScope.full)
  @Get()
  @ApiQuery({ name: 'searchString', required: false })
  @ApiQuery({ name: 'page', required: true })
  @ApiQuery({ name: 'count', required: true })
  @ApiQuery({ name: 'includeArchived', required: false })
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
    @Query('includeArchived') includeArchived = false,
  ): Promise<PagedRowsDto<Client>> {
    if (searchString) {
      return this.clientsService.findClients(
        searchString,
        page,
        count,
        includeArchived,
      )
    }

    return this.clientsService.findAndCountAll(page, count, includeArchived)
  }

  /** Gets client by id */
  @Scopes(AuthAdminScope.root, AuthAdminScope.full)
  @Get(':id')
  @ApiOkResponse({ type: Client })
  @Audit<Client>({
    resources: (client) => client?.clientId,
  })
  async findOne(@Param('id') id: string): Promise<Client> {
    if (!id) {
      throw new BadRequestException('Id must be provided')
    }

    const client = await this.clientsService.findClientById(id)
    if (!client) {
      throw new NoContentException()
    }
    return client
  }

  /** Creates a new client */
  @Scopes(AuthAdminScope.root, AuthAdminScope.full)
  @Post()
  @ApiCreatedResponse({ type: Client })
  @Audit<Client>({
    resources: (client) => client.clientId,
  })
  async create(@Body() client: ClientDTO): Promise<Client> {
    return this.clientsService.create(client)
  }

  /** Updates an existing client */
  @Scopes(AuthAdminScope.root, AuthAdminScope.full)
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
        auth: user,
        action: 'update',
        namespace,
        resources: id,
        meta: { fields: Object.keys(client) },
      },
      this.clientsService.update(client, id),
    )
  }

  /** Soft deleting a client by Id */
  @Scopes(AuthAdminScope.root, AuthAdminScope.full)
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
        auth: user,
        action: 'delete',
        namespace,
        resources: id,
      },
      this.clientsService.delete(id),
    )
  }
}
