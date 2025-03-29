import {
  BadRequestException,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  Delete,
  Body,
  VERSION_NEUTRAL,
} from '@nestjs/common'
import {
  ApiExcludeController,
  ApiOkResponse,
  ApiQuery,
  getSchemaPath,
} from '@nestjs/swagger'
import {
  GrantType,
  GrantTypeService,
  GrantTypeDTO,
  PagedRowsDto,
} from '@island.is/auth-api-lib'
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

const namespace = `@island.is/auth-admin-api/grant-type`

@UseGuards(IdsUserGuard, ScopesGuard)
@ApiExcludeController()
@Controller({ path: 'grants', version: [VERSION_NEUTRAL, '1'] })
@Audit({ namespace })
export class GrantTypeController {
  constructor(
    private readonly grantTypeService: GrantTypeService,
    private readonly auditService: AuditService,
  ) {}

  /** Gets all Grant Types */
  @Scopes(AuthAdminScope.root, AuthAdminScope.full)
  @Get()
  @ApiOkResponse({ type: [GrantType] })
  @Audit<GrantType[]>({
    resources: (types) => types.map((type) => type.name),
  })
  async findAll(): Promise<GrantType[]> {
    return this.grantTypeService.findAll()
  }

  /** Gets all grant types and count of rows */
  @Scopes(AuthAdminScope.root, AuthAdminScope.full)
  @Get('search')
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
              items: { $ref: getSchemaPath(GrantType) },
            },
          },
        },
      ],
    },
  })
  @Audit<PagedRowsDto<GrantType>>({
    resources: (result) => result.rows.map((type) => type.name),
  })
  async findAndCountAll(
    @Query('searchString') searchString: string,
    @Query('page') page: number,
    @Query('count') count: number,
    @Query('includeArchived') includeArchived = false,
  ): Promise<PagedRowsDto<GrantType>> {
    if (searchString) {
      return this.grantTypeService.find(
        searchString,
        page,
        count,
        includeArchived,
      )
    }

    return this.grantTypeService.findAndCountAll(page, count, includeArchived)
  }

  /** Gets a grant type by name */
  @Scopes(AuthAdminScope.root, AuthAdminScope.full)
  @Get('type/:name')
  @ApiOkResponse({ type: GrantType })
  @Audit<GrantType>({
    resources: (type) => type?.name,
  })
  async getGrantType(@Param('name') name: string): Promise<GrantType> {
    if (!name) {
      throw new BadRequestException('Name must be provided')
    }

    const grantType = await this.grantTypeService.getGrantType(name)

    if (!grantType) {
      throw new NotFoundException("This particular grantType doesn't exist")
    }

    return grantType
  }

  /** Creates a new grant type */
  @Scopes(AuthAdminScope.root, AuthAdminScope.full)
  @Post()
  @ApiOkResponse({ type: GrantType })
  @Audit<GrantType>({
    resources: (type) => type.name,
  })
  async createGrantType(@Body() grantType: GrantTypeDTO): Promise<GrantType> {
    if (!grantType) {
      throw new BadRequestException('grantType must be provided')
    }

    return this.grantTypeService.create(grantType)
  }

  /** Updates an existing grantType */
  @Scopes(AuthAdminScope.root, AuthAdminScope.full)
  @Put(':name')
  @ApiOkResponse({ type: GrantType })
  async updateGrantType(
    @Body() grantType: GrantTypeDTO,
    @Param('name') name: string,
    @CurrentUser() user: User,
  ): Promise<GrantType> {
    if (!name) {
      throw new BadRequestException('name must be provided')
    }
    if (!grantType) {
      throw new BadRequestException('grantType must be provided')
    }

    return this.auditService.auditPromise(
      {
        auth: user,
        action: 'updateGrantType',
        namespace,
        resources: name,
        meta: { fields: Object.keys(grantType) },
      },
      this.grantTypeService.update(grantType, name),
    )
  }

  /** Soft deletes a grant type */
  @Scopes(AuthAdminScope.root, AuthAdminScope.full)
  @Delete(':name')
  @ApiOkResponse({ type: Number })
  async deleteGrantType(
    @Param('name') name: string,
    @CurrentUser() user: User,
  ): Promise<number> {
    if (!name) {
      throw new BadRequestException('name must be provided')
    }
    return this.auditService.auditPromise(
      {
        auth: user,
        action: 'deleteGrantType',
        namespace,
        resources: name,
      },
      this.grantTypeService.delete(name),
    )
  }
}
