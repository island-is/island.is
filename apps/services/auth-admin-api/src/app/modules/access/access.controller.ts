import {
  AccessService,
  ApiScopeUserDTO,
  ApiScopeUser,
  ApiScopeUserUpdateDTO,
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

@UseGuards(IdsUserGuard, ScopesGuard)
@ApiTags('api-access')
@Controller('backend/api-access')
@Audit({
  namespace: environment.audit.defaultNamespace + '/access',
})
export class AccessController {
  constructor(
    private readonly accessService: AccessService,
    private readonly auditService: AuditService,
  ) {}

  /** Gets admin's access rights by id */
  @Scopes(Scope.root, Scope.full)
  @Get(':nationalId')
  @ApiOkResponse({ type: ApiScopeUser })
  @Audit<ApiScopeUser>({
    resources: (user) => user?.nationalId ?? '',
  })
  async findOne(
    @Param('nationalId') nationalId: string,
  ): Promise<ApiScopeUser | null> {
    if (!nationalId) {
      throw new BadRequestException('NationalId must be provided')
    }

    const apiScopeUser = await this.accessService.findOne(nationalId)
    return apiScopeUser
  }

  /** Gets x many admins based on pagenumber and count variable */
  @Scopes(Scope.root, Scope.full)
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
  @Audit()
  async findAndCountAll(
    @Query('searchString') searchString: string,
    @Query('page') page: number,
    @Query('count') count: number,
  ): Promise<{ rows: ApiScopeUser[]; count: number } | null> {
    const admins = await this.accessService.findAndCountAll(
      searchString,
      page,
      count,
    )
    return admins
  }

  /** Creates a new Api Scope User */
  @Scopes(Scope.root, Scope.full)
  @Post()
  @ApiCreatedResponse({ type: ApiScopeUser })
  async create(
    @Body() apiScopeUser: ApiScopeUserDTO,
    @CurrentUser() user: User,
  ): Promise<ApiScopeUser | null> {
    const response = await this.auditService.auditPromise(
      {
        user,
        action: 'create',
        resources: apiScopeUser.nationalId,
        meta: { fields: Object.keys(apiScopeUser) },
      },
      this.accessService.create(apiScopeUser),
    )
    return response
  }

  /** Updates an existing Api Scope User */
  @Scopes(Scope.root, Scope.full)
  @Put(':nationalId')
  @ApiCreatedResponse({ type: ApiScopeUser })
  async update(
    @Body() admin: ApiScopeUserUpdateDTO,
    @Param('nationalId') nationalId: string,
    @CurrentUser() user: User,
  ): Promise<ApiScopeUser | null> {
    if (!nationalId) {
      throw new BadRequestException('NationalId must be provided')
    }

    return await this.auditService.auditPromise(
      {
        user,
        action: 'udpate',
        resources: nationalId,
        meta: { fields: Object.keys(admin) },
      },
      this.accessService.update(admin, nationalId),
    )
  }

  /** Deleting an admin by nationalId */
  @Scopes(Scope.root, Scope.full)
  @Delete(':nationalId')
  @ApiCreatedResponse({ type: Number })
  async delete(
    @Param('nationalId') nationalId: string,
    @CurrentUser() user: User,
  ): Promise<number> {
    if (!nationalId) {
      throw new BadRequestException('nationalId must be provided')
    }

    return await this.auditService.auditPromise(
      {
        user,
        action: 'delete',
        resources: nationalId,
      },
      this.accessService.delete(nationalId),
    )
  }
}
