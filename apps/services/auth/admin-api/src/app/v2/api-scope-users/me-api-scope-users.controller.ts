import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common'
import { ApiSecurity, ApiTags } from '@nestjs/swagger'

import {
  ApiScope,
  ApiScopeUser,
  ApiScopeUserDTO,
  ApiScopeUserUpdateDTO,
  PagedRowsDto,
  ResourceAccessService,
  ResourcesService,
} from '@island.is/auth-api-lib'
import {
  CurrentUser,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
  User,
} from '@island.is/auth-nest-tools'
import { AdminPortalScope } from '@island.is/auth/scopes'
import { Audit, AuditService } from '@island.is/nest/audit'
import { Documentation } from '@island.is/nest/swagger'
import { NoContentException } from '@island.is/nest/problem'

import { PagedApiScopeUsersDto } from './dto/paged-api-scope-users.dto'

const namespace = '@island.is/auth/admin-api/v2/api-scope-users'

@UseGuards(IdsUserGuard, ScopesGuard)
@Scopes(AdminPortalScope.idsAdminSuperUser)
@ApiSecurity('ias', [AdminPortalScope.idsAdminSuperUser])
@ApiTags('admin')
@Controller({
  path: 'me/api-scope-users',
  version: ['2'],
})
@Audit({ namespace })
export class MeApiScopeUsersController {
  constructor(
    private readonly auditService: AuditService,
    private readonly accessService: ResourceAccessService,
    private readonly resourcesService: ResourcesService,
  ) {}

  @Get('access-controlled-scopes')
  @Documentation({
    description: 'Get all access-controlled API scopes.',
    response: { status: 200, type: [ApiScope] },
  })
  @Audit<ApiScope[]>({
    resources: (scopes) => scopes.map((scope) => scope.name),
  })
  findAllAccessControlledScopes(): Promise<ApiScope[]> {
    return this.resourcesService.findAllAccessControlledApiScopes()
  }

  @Get()
  @Documentation({
    description: 'Get a paginated list of API scope users.',
    response: { status: 200, type: PagedApiScopeUsersDto },
    request: {
      query: {
        searchString: {
          required: false,
          type: 'string',
          description: 'Search by name, national ID, or email',
        },
        page: { required: true, type: 'number' },
        count: { required: true, type: 'number' },
      },
    },
  })
  @Audit<PagedRowsDto<ApiScopeUser>>({
    resources: (result) => result.rows.map((user) => user.nationalId),
  })
  findAndCountAll(
    @Query('searchString') searchString: string,
    @Query('page', ParseIntPipe) page: number,
    @Query('count', ParseIntPipe) count: number,
  ): Promise<PagedRowsDto<ApiScopeUser>> {
    return this.accessService.findAndCountAll(searchString, page, count)
  }

  @Get(':nationalId')
  @Documentation({
    description: 'Get an API scope user by national ID.',
    response: { status: 200, type: ApiScopeUser },
    includeNoContentResponse: true,
  })
  @Audit<ApiScopeUser>({
    resources: (user) => user?.nationalId,
  })
  async findOne(
    @Param('nationalId') nationalId: string,
  ): Promise<ApiScopeUser> {
    const apiScopeUser = await this.accessService.findOne(nationalId)
    if (!apiScopeUser) {
      throw new NoContentException()
    }
    return apiScopeUser
  }

  @Post()
  @Documentation({
    description: 'Create a new API scope user.',
    response: { status: 201, type: ApiScopeUser },
  })
  @Audit<ApiScopeUser>({
    resources: (user) => user?.nationalId,
    alsoLog: true,
  })
  create(@Body() input: ApiScopeUserDTO): Promise<ApiScopeUser> {
    return this.accessService.create(input)
  }

  @Patch(':nationalId')
  @Documentation({
    description: 'Update an existing API scope user.',
    response: { status: 200, type: ApiScopeUser },
  })
  update(
    @CurrentUser() user: User,
    @Param('nationalId') nationalId: string,
    @Body() input: ApiScopeUserUpdateDTO,
  ): Promise<ApiScopeUser> {
    return this.auditService.auditPromise<ApiScopeUser>(
      {
        namespace,
        auth: user,
        action: 'update',
        resources: nationalId,
        alsoLog: true,
        meta: { fields: Object.keys(input) },
      },
      this.accessService.update(input, nationalId),
    )
  }

  @Delete(':nationalId')
  @HttpCode(204)
  @Documentation({
    description: 'Delete an API scope user.',
    response: { status: 204 },
  })
  async delete(
    @CurrentUser() user: User,
    @Param('nationalId') nationalId: string,
  ): Promise<void> {
    await this.auditService.auditPromise(
      {
        namespace,
        auth: user,
        action: 'delete',
        resources: nationalId,
        alsoLog: true,
      },
      this.accessService.delete(nationalId),
    )
  }
}
