import {
  Controller,
  Get,
  Param,
  VERSION_NEUTRAL,
  UseGuards,
} from '@nestjs/common'
import { ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger'
import { OrganizationsService } from './organizations.service'
import {
  CurrentUser,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
  User,
} from '@island.is/auth-nest-tools'
import { AdminPortalScope } from '@island.is/auth/scopes'
import { OrganizationAdminDto } from './models/dto/organizationAdmin.dto'

@UseGuards(IdsUserGuard, ScopesGuard)
@Scopes(AdminPortalScope.formSystem)
@ApiTags('organizations')
@Controller({ path: 'organizations', version: ['1', VERSION_NEUTRAL] })
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) {}

  @ApiOperation({ summary: 'Get organization admin' })
  @ApiOkResponse({
    description: 'Get organization admin',
    type: OrganizationAdminDto,
  })
  @ApiParam({ name: 'nationalId', type: String })
  @Get('admin/:nationalId')
  async findAdmin(
    @CurrentUser()
    user: User,
    @Param('nationalId') nationalId: string,
  ): Promise<OrganizationAdminDto> {
    return await this.organizationsService.findAdmin(user, nationalId)
  }
}
