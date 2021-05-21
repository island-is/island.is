import {
  IdpProviderService,
  IdpProvider,
  IdpProviderDTO,
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

const namespace = `${environment.audit.defaultNamespace}/idp-provider`

@UseGuards(IdsUserGuard, ScopesGuard)
@ApiTags('idp-provider')
@Controller('backend/idp-provider')
@Audit({ namespace })
export class IdpProviderController {
  constructor(
    private readonly idpProviderService: IdpProviderService,
    private readonly auditService: AuditService,
  ) {}

  /** Gets all idp restrictions and count of rows */
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
              items: { $ref: getSchemaPath(IdpProvider) },
            },
          },
        },
      ],
    },
  })
  @Audit<PagedRowsDto<IdpProvider>>({
    resources: (results) => results.rows.map((idp) => idp.name),
  })
  async findAndCountAll(
    @Query('searchString') searchString: string,
    @Query('page') page: number,
    @Query('count') count: number,
  ): Promise<PagedRowsDto<IdpProvider>> {
    if (searchString) {
      return this.idpProviderService.find(searchString, page, count)
    }

    return this.idpProviderService.findAndCountAll(page, count)
  }

  /** Finds available idp restrictions */
  @Scopes(Scope.root, Scope.full)
  @Get(':name')
  @ApiOkResponse({ type: IdpProvider })
  @Audit<IdpProvider>({
    resources: (idp) => idp?.name,
  })
  async findByPk(@Param('name') name: string): Promise<IdpProvider> {
    return this.idpProviderService.findByPk(name)
  }

  /** Adds new IDP provider */
  @Scopes(Scope.root, Scope.full)
  @Post()
  @ApiCreatedResponse({ type: IdpProvider })
  @Audit<IdpProvider>({
    resources: (idp) => idp.name,
  })
  async create(@Body() idpProvider: IdpProviderDTO): Promise<IdpProvider> {
    return this.idpProviderService.create(idpProvider)
  }

  /** Deletes an idp provider */
  @Scopes(Scope.root, Scope.full)
  @Delete(':name')
  @ApiCreatedResponse()
  async delete(
    @Param('name') name: string,
    @CurrentUser() user: User,
  ): Promise<number> {
    if (!name) {
      throw new BadRequestException('name must be provided')
    }

    return this.auditService.auditPromise(
      {
        user,
        action: 'delete',
        namespace,
        resources: name,
      },
      this.idpProviderService.delete(name),
    )
  }

  /** Updates an idp provider */
  @Scopes(Scope.root, Scope.full)
  @Put(':name')
  @ApiCreatedResponse()
  async update(
    @Param('name') name: string,
    @Body() idpProvider: IdpProviderDTO,
    @CurrentUser() user: User,
  ): Promise<[number, IdpProvider[]]> {
    if (!name) {
      throw new BadRequestException('name must be provided')
    }
    if (!idpProvider) {
      throw new BadRequestException('idpProvider object must be provided')
    }

    return this.auditService.auditPromise(
      {
        user,
        action: 'update',
        namespace,
        resources: name,
        meta: { fields: Object.keys(idpProvider) },
      },
      this.idpProviderService.update(idpProvider, name),
    )
  }
}
