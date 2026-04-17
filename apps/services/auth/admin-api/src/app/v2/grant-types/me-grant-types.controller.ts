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
  GrantType,
  GrantTypeDTO,
  GrantTypeService,
  PagedRowsDto,
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

import { PagedGrantTypesDto } from './dto/paged-grant-types.dto'
import { UpdateGrantTypeDto } from './dto/update-grant-type.dto'

const namespace = '@island.is/auth/admin-api/v2/grant-types'

@UseGuards(IdsUserGuard, ScopesGuard)
@Scopes(AdminPortalScope.idsAdminSuperUser)
@ApiSecurity('ias', [AdminPortalScope.idsAdminSuperUser])
@ApiTags('admin')
@Controller({
  path: 'me/grant-types',
  version: ['2'],
})
@Audit({ namespace })
export class MeGrantTypesController {
  constructor(
    private readonly auditService: AuditService,
    private readonly grantTypeService: GrantTypeService,
  ) {}

  @Get()
  @Documentation({
    description: 'Get a paginated list of grant types.',
    response: { status: 200, type: PagedGrantTypesDto },
    request: {
      query: {
        searchString: {
          required: false,
          type: 'string',
          description: 'Search by name or description',
        },
        page: { required: true, type: 'number' },
        count: { required: true, type: 'number' },
      },
    },
  })
  @Audit<PagedRowsDto<GrantType>>({
    resources: (result) => result.rows.map((gt) => gt.name),
  })
  findAndCountAll(
    @Query('searchString') searchString: string,
    @Query('page', ParseIntPipe) page: number,
    @Query('count', ParseIntPipe) count: number,
  ): Promise<PagedRowsDto<GrantType>> {
    return this.grantTypeService.search(searchString, page, count, true)
  }

  @Get(':name')
  @Documentation({
    description: 'Get a grant type by name.',
    response: { status: 200, type: GrantType },
    includeNoContentResponse: true,
  })
  @Audit<GrantType>({
    resources: (gt) => gt?.name,
  })
  async findOne(@Param('name') name: string): Promise<GrantType> {
    const grantType = await this.grantTypeService.getGrantType(name)
    if (!grantType) {
      throw new NoContentException()
    }
    return grantType
  }

  @Post()
  @Documentation({
    description: 'Create a new grant type.',
    response: { status: 201, type: GrantType },
  })
  @Audit<GrantType>({
    resources: (gt) => gt.name,
    alsoLog: true,
  })
  create(@Body() input: GrantTypeDTO): Promise<GrantType> {
    return this.grantTypeService.create(input)
  }

  @Patch(':name')
  @Documentation({
    description: 'Update an existing grant type.',
    response: { status: 200, type: GrantType },
  })
  update(
    @CurrentUser() user: User,
    @Param('name') name: string,
    @Body() input: UpdateGrantTypeDto,
  ): Promise<GrantType> {
    return this.auditService.auditPromise<GrantType>(
      {
        namespace,
        auth: user,
        action: 'update',
        resources: name,
        alsoLog: true,
        meta: { fields: Object.keys(input) },
      },
      this.grantTypeService.update({ name, description: input.description }, name),
    )
  }

  @Delete(':name')
  @HttpCode(204)
  @Documentation({
    description: 'Soft delete a grant type.',
    response: { status: 204 },
  })
  async delete(
    @CurrentUser() user: User,
    @Param('name') name: string,
  ): Promise<void> {
    await this.auditService.auditPromise(
      {
        namespace,
        auth: user,
        action: 'delete',
        resources: name,
        alsoLog: true,
      },
      this.grantTypeService.delete(name),
    )
  }
}
