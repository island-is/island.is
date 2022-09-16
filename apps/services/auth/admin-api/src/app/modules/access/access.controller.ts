import {
  ResourceAccessService,
  ApiScopeUserDTO,
  ApiScopeUser,
  ApiScopeUserUpdateDTO,
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

const namespace = `${environment.audit.defaultNamespace}/access`

@UseGuards(IdsUserGuard, ScopesGuard)
@ApiTags('api-access')
@Controller('backend/api-access')
@Audit({ namespace })
export class AccessController {
  constructor(
    private readonly accessService: ResourceAccessService,
    private readonly auditService: AuditService,
  ) {}

  /** Gets admin's access rights by id */
  @Scopes(AuthAdminScope.root, AuthAdminScope.full)
  @Get(':nationalId')
  @ApiOkResponse({ type: ApiScopeUser })
  @Audit<ApiScopeUser>({
    resources: (user) => user?.nationalId,
  })
  async findOne(
    @Param('nationalId') nationalId: string,
  ): Promise<ApiScopeUser> {
    if (!nationalId) {
      throw new BadRequestException('NationalId must be provided')
    }

    return this.accessService.findOne(nationalId)
  }

  /** Gets x many admins based on pagenumber and count variable */
  @Scopes(AuthAdminScope.root, AuthAdminScope.full)
  @Get()
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
              items: { $ref: getSchemaPath(ApiScopeUser) },
            },
          },
        },
      ],
    },
  })
  @Audit<PagedRowsDto<ApiScopeUser>>({
    resources: (result) => result.rows.map((user) => user.nationalId),
  })
  async findAndCountAll(
    @Query('searchString') searchString: string,
    @Query('page') page: number,
    @Query('count') count: number,
  ): Promise<PagedRowsDto<ApiScopeUser>> {
    return this.accessService.findAndCountAll(searchString, page, count)
  }

  /** Creates a new Api Scope User */
  @Scopes(AuthAdminScope.root, AuthAdminScope.full)
  @Post()
  @ApiCreatedResponse({ type: ApiScopeUser })
  @Audit<ApiScopeUser>({
    resources: (user) => user?.nationalId,
  })
  async create(@Body() apiScopeUser: ApiScopeUserDTO): Promise<ApiScopeUser> {
    return this.accessService.create(apiScopeUser)
  }

  /** Updates an existing Api Scope User */
  @Scopes(AuthAdminScope.root, AuthAdminScope.full)
  @Put(':nationalId')
  @ApiCreatedResponse({ type: ApiScopeUser })
  async update(
    @Body() admin: ApiScopeUserUpdateDTO,
    @Param('nationalId') nationalId: string,
    @CurrentUser() user: User,
  ): Promise<ApiScopeUser> {
    if (!nationalId) {
      throw new BadRequestException('NationalId must be provided')
    }

    return this.auditService.auditPromise(
      {
        auth: user,
        action: 'udpate',
        namespace,
        resources: nationalId,
        meta: { fields: Object.keys(admin) },
      },
      this.accessService.update(admin, nationalId),
    )
  }

  /** Deleting an admin by nationalId */
  @Scopes(AuthAdminScope.root, AuthAdminScope.full)
  @Delete(':nationalId')
  @ApiCreatedResponse({ type: Number })
  async delete(
    @Param('nationalId') nationalId: string,
    @CurrentUser() user: User,
  ): Promise<number> {
    if (!nationalId) {
      throw new BadRequestException('nationalId must be provided')
    }

    return this.auditService.auditPromise(
      {
        auth: user,
        action: 'delete',
        namespace,
        resources: nationalId,
      },
      this.accessService.delete(nationalId),
    )
  }
}
