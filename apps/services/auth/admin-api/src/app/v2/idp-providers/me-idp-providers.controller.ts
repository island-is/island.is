import {
  BadRequestException,
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
  IdpProvider,
  IdpProviderDTO,
  IdpProviderService,
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

import { PagedIdpProvidersDto } from './dto/paged-idp-providers.dto'
import { UpdateIdpProviderDto } from './dto/update-idp-provider.dto'
import { DeleteIdpProviderDto } from './dto/delete-idp-provider.dto'

const namespace = '@island.is/auth/admin-api/v2/idp-providers'

@UseGuards(IdsUserGuard, ScopesGuard)
@Scopes(AdminPortalScope.idsAdminSuperUser)
@ApiSecurity('ias', [AdminPortalScope.idsAdminSuperUser])
@ApiTags('admin')
@Controller({
  path: 'me/idp-providers',
  version: ['2'],
})
@Audit({ namespace })
export class MeIdpProvidersController {
  constructor(
    private readonly auditService: AuditService,
    private readonly idpProviderService: IdpProviderService,
  ) {}

  @Get()
  @Documentation({
    description: 'Get a paginated list of IDP providers.',
    response: { status: 200, type: PagedIdpProvidersDto },
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
  @Audit<PagedRowsDto<IdpProvider>>({
    resources: (result) => result.rows.map((idp) => idp.name),
  })
  findAndCountAll(
    @Query('searchString') searchString: string,
    @Query('page', ParseIntPipe) page: number,
    @Query('count', ParseIntPipe) count: number,
  ): Promise<PagedRowsDto<IdpProvider>> {
    if (page < 1 || count < 1) {
      throw new BadRequestException('page and count must be positive integers')
    }

    return this.idpProviderService.search(searchString, page, count)
  }

  @Get(':name')
  @Documentation({
    description: 'Get an IDP provider by name.',
    response: { status: 200, type: IdpProvider },
    includeNoContentResponse: true,
  })
  @Audit<IdpProvider>({
    resources: (idp) => idp?.name,
  })
  async findOne(@Param('name') name: string): Promise<IdpProvider> {
    const idpProvider = await this.idpProviderService.findByPk(name)
    if (!idpProvider) {
      throw new NoContentException()
    }
    return idpProvider
  }

  @Post()
  @Documentation({
    description: 'Create a new IDP provider.',
    response: { status: 201, type: IdpProvider },
  })
  @Audit<IdpProvider>({
    resources: (idp) => idp.name,
    alsoLog: true,
  })
  create(@Body() input: IdpProviderDTO): Promise<IdpProvider> {
    return this.idpProviderService.create(input)
  }

  @Patch(':name')
  @Documentation({
    description: 'Update an existing IDP provider.',
    response: { status: 200, type: IdpProvider },
  })
  update(
    @CurrentUser() user: User,
    @Param('name') name: string,
    @Body() input: UpdateIdpProviderDto,
  ): Promise<IdpProvider> {
    return this.auditService.auditPromise<IdpProvider>(
      {
        namespace,
        auth: user,
        action: 'update',
        resources: name,
        alsoLog: true,
        meta: { fields: Object.keys(input) },
      },
      this.idpProviderService.update(
        {
          name,
          description: input.description,
          helptext: input.helptext,
          level: input.level,
        },
        name,
      ),
    )
  }

  @Delete(':name')
  @HttpCode(204)
  @Documentation({
    description: 'Delete an IDP provider.',
    response: { status: 204 },
  })
  async delete(
    @CurrentUser() user: User,
    @Param('name') name: string,
    @Body() input: DeleteIdpProviderDto,
  ): Promise<void> {
    await this.auditService.auditPromise(
      {
        namespace,
        auth: user,
        action: 'delete',
        resources: name,
        alsoLog: true,
        meta: { environments: input.environments },
      },
      this.idpProviderService.delete(name, input.environments),
    )
  }
}
