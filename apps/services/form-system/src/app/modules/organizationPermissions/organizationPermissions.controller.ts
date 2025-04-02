import {
  Body,
  Controller,
  Delete,
  Post,
  UseGuards,
  VERSION_NEUTRAL,
} from '@nestjs/common'
import {
  ApiBody,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger'
import { IdsUserGuard, Scopes, ScopesGuard } from '@island.is/auth-nest-tools'
import { AdminPortalScope } from '@island.is/auth/scopes'
import { OrganizationPermissionsService } from './organizationPermissions.service'
import { OrganizationPermissionDto } from './models/dto/organizationPermission.dto'
import { UpdateOrganizationPermissionDto } from './models/dto/updateOrganizationPermission.dto'

@UseGuards(IdsUserGuard, ScopesGuard)
@Scopes(AdminPortalScope.formSystemAdmin)
@ApiTags('organization permissions')
@Controller({
  path: 'organizationPermissions',
  version: ['1', VERSION_NEUTRAL],
})
export class OrganizationPermissionsController {
  constructor(
    private organizationPermissionsService: OrganizationPermissionsService,
  ) {}

  @ApiOperation({ summary: 'Add organization permission' })
  @ApiCreatedResponse({
    description: 'Add organization permission',
    type: OrganizationPermissionDto,
  })
  @ApiBody({ type: UpdateOrganizationPermissionDto })
  @Post()
  create(
    @Body()
    createOrganizationPermissionDto: UpdateOrganizationPermissionDto,
  ): Promise<OrganizationPermissionDto> {
    return this.organizationPermissionsService.create(
      createOrganizationPermissionDto,
    )
  }

  @ApiOperation({ summary: 'Remove organization permission' })
  @ApiNoContentResponse({
    description: 'Remove organization permission',
  })
  @ApiBody({ type: UpdateOrganizationPermissionDto })
  @Delete()
  async delete(
    @Body()
    deleteOrganizationPermissionDto: UpdateOrganizationPermissionDto,
  ): Promise<void> {
    return this.organizationPermissionsService.delete(
      deleteOrganizationPermissionDto,
    )
  }
}
