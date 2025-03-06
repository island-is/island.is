import {
  IdpProviderService,
  IdpProvider,
  IdpProviderDTO,
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

const namespace = `@island.is/auth-admin-api/idp-provider`

@UseGuards(IdsUserGuard, ScopesGuard)
@ApiExcludeController()
@Controller({ path: 'idp-provider', version: [VERSION_NEUTRAL, '1'] })
@Audit({ namespace })
export class IdpProviderController {
  constructor(
    private readonly idpProviderService: IdpProviderService,
    private readonly auditService: AuditService,
  ) {}

  /** Gets all idp restrictions and count of rows */
  @Scopes(AuthAdminScope.root, AuthAdminScope.full)
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
  @Scopes(AuthAdminScope.root, AuthAdminScope.full)
  @Get(':name')
  @ApiOkResponse({ type: IdpProvider })
  @Audit<IdpProvider>({
    resources: (idp) => idp?.name,
  })
  async findByPk(@Param('name') name: string): Promise<IdpProvider> {
    const idpProvider = await this.idpProviderService.findByPk(name)
    if (!idpProvider) {
      throw new NoContentException()
    }
    return idpProvider
  }

  /** Adds new IDP provider */
  @Scopes(AuthAdminScope.root, AuthAdminScope.full)
  @Post()
  @ApiCreatedResponse({ type: IdpProvider })
  @Audit<IdpProvider>({
    resources: (idp) => idp.name,
  })
  async create(@Body() idpProvider: IdpProviderDTO): Promise<IdpProvider> {
    return this.idpProviderService.create(idpProvider)
  }

  /** Deletes an idp provider */
  @Scopes(AuthAdminScope.root, AuthAdminScope.full)
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
        auth: user,
        action: 'delete',
        namespace,
        resources: name,
      },
      this.idpProviderService.delete(name),
    )
  }

  /** Updates an idp provider */
  @Scopes(AuthAdminScope.root, AuthAdminScope.full)
  @Put(':name')
  @ApiCreatedResponse()
  async update(
    @Param('name') name: string,
    @Body() idpProvider: IdpProviderDTO,
    @CurrentUser() user: User,
  ): Promise<IdpProvider> {
    if (!name) {
      throw new BadRequestException('name must be provided')
    }
    if (!idpProvider) {
      throw new BadRequestException('idpProvider object must be provided')
    }

    return this.auditService.auditPromise(
      {
        auth: user,
        action: 'update',
        namespace,
        resources: name,
        meta: { fields: Object.keys(idpProvider) },
      },
      this.idpProviderService.update(idpProvider, name),
    )
  }
}
