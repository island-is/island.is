import {
  PersonalRepresentativeScopePermission,
  PersonalRepresentativeScopePermissionDTO,
  PersonalRepresentativeScopePermissionService,
  PaginatedPersonalRepresentativeRightTypeDto,
  PersonalRepresentativeRightType,
  PersonalRepresentativeRightTypeService,
} from '@island.is/auth-api-lib'
import {
  BadRequestException,
  Body,
  Controller,
  UseGuards,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Inject,
  Query,
  forwardRef,
  VERSION_NEUTRAL,
} from '@nestjs/common'
import {
  ApiOperation,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiQuery,
  ApiExcludeController,
} from '@nestjs/swagger'
import type { User } from '@island.is/auth-nest-tools'
import {
  IdsUserGuard,
  ScopesGuard,
  Scopes,
  CurrentUser,
} from '@island.is/auth-nest-tools'
import { Audit, AuditService } from '@island.is/nest/audit'
import { environment } from '../../../environments/'
import { AuthAdminScope } from '@island.is/auth/scopes'

const namespace = `${environment.audit.defaultNamespace}/personal-representative`

@UseGuards(IdsUserGuard, ScopesGuard)
@ApiExcludeController()
@Controller({
  path: 'personal-representative',
  version: [VERSION_NEUTRAL, '1'],
})
@Audit({ namespace })
export class PersonalRepresentativeController {
  constructor(
    private readonly rightTypesService: PersonalRepresentativeRightTypeService,
    @Inject(forwardRef(() => PersonalRepresentativeScopePermissionService))
    private readonly scopePermissionService: PersonalRepresentativeScopePermissionService,
    @Inject(AuditService)
    private readonly auditService: AuditService,
  ) {}

  @ApiOperation({
    summary: 'Get a list of all permissions for a scope',
  })
  @Scopes(AuthAdminScope.root, AuthAdminScope.full)
  @Get('/permissions')
  @ApiQuery({ name: 'apiScopeName', required: false })
  @ApiOkResponse({ type: [PersonalRepresentativeRightType] })
  @Audit<PersonalRepresentativeRightType[]>({
    resources: (result) => result.map((permission) => permission.id),
  })
  async getScopePermissions(
    @Query('apiScopeName') apiScopeName: string,
  ): Promise<PersonalRepresentativeScopePermission[]> {
    const scopePermissions =
      this.scopePermissionService.getScopePermissionsAsync(apiScopeName)
    return scopePermissions
  }

  @ApiOperation({
    summary: 'Create a scope permission',
  })
  @Scopes(AuthAdminScope.root, AuthAdminScope.full)
  @Post('/permissions')
  @ApiCreatedResponse({ type: PersonalRepresentativeRightType })
  @Audit<PersonalRepresentativeRightType>({
    resources: (permission) => permission.id,
  })
  async createScopePermission(
    @Body() scopePermission: PersonalRepresentativeScopePermissionDTO,
  ): Promise<PersonalRepresentativeScopePermission | void> {
    return await this.scopePermissionService
      .createScopePermissionAsync(scopePermission)
      .catch((error) => {
        if (error.name === 'SequelizeUniqueConstraintError') {
          throw new BadRequestException(
            'An entity with this value pair already exists.',
          )
        } else {
          throw error
        }
      })
  }

  @ApiOperation({
    summary: 'Delete a scope permission',
  })
  @Scopes(AuthAdminScope.root, AuthAdminScope.full)
  @Delete('/permissions/:id')
  @ApiOkResponse()
  async deleteScopePermission(
    @Param('id') id: string,
    @CurrentUser() user: User,
  ): Promise<void> {
    if (!id) {
      throw new BadRequestException('Id must be provided')
    }

    return this.auditService.auditPromise(
      {
        auth: user,
        action: 'deleteScopePermission',
        namespace,
        resources: id,
      },
      this.scopePermissionService.deleteScopePermissionAsync(id),
    )
  }

  /** Gets all right types */
  @ApiOperation({
    summary: 'Get a list of all permission types',
  })
  @Scopes(AuthAdminScope.root, AuthAdminScope.full)
  @Get('/permission-types')
  @ApiOkResponse({ type: PaginatedPersonalRepresentativeRightTypeDto })
  async getAvailablePermissions(): Promise<PaginatedPersonalRepresentativeRightTypeDto> {
    const permissionTypes = await this.rightTypesService.getMany({}) //getAllAsync()

    if (!permissionTypes) {
      throw new NotFoundException('No permissions found')
    }

    return permissionTypes
  }
}
