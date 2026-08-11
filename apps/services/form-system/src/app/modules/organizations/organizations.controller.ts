import {
  HttpCode,
  HttpStatus,
  Controller,
  Get,
  Param,
  VERSION_NEUTRAL,
  UseGuards,
  Put,
  Body,
  Post,
  Delete,
} from '@nestjs/common'
import {
  ApiBody,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger'
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
import { OrganizationZendeskInstanceDto } from './models/dto/organizationZendeskInstance.dto'
import { OrganizationDelegationDto } from './models/dto/organizationDelegation.dto'

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

  @ApiOperation({
    summary: 'Update zendesk instance and brandId for organization',
  })
  @ApiNoContentResponse({
    description: 'Update zendesk instance and brandId for organization',
  })
  @ApiBody({ type: OrganizationZendeskInstanceDto })
  @Put('zendesk')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateZendeskInstance(
    @CurrentUser()
    user: User,
    @Body() organizationZendeskInstanceDto: OrganizationZendeskInstanceDto,
  ): Promise<void> {
    return await this.organizationsService.updateZendeskInstance(
      user,
      organizationZendeskInstanceDto,
    )
  }

  @ApiOperation({ summary: 'Add organization delegation' })
  @ApiNoContentResponse({
    description: 'Add organization delegation',
  })
  @ApiBody({ type: OrganizationDelegationDto })
  @Post('delegation')
  @HttpCode(HttpStatus.NO_CONTENT)
  async addDelegation(
    @CurrentUser()
    user: User,
    @Body() organizationDelegationDto: OrganizationDelegationDto,
  ): Promise<void> {
    return await this.organizationsService.addDelegation(
      user,
      organizationDelegationDto,
    )
  }

  @ApiOperation({ summary: 'Delete organization delegation' })
  @ApiNoContentResponse({
    description: 'Delete organization delegation',
  })
  @ApiBody({ type: OrganizationDelegationDto })
  @Delete('delegation')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteDelegation(
    @CurrentUser()
    user: User,
    @Body() organizationDelegationDto: OrganizationDelegationDto,
  ): Promise<void> {
    return await this.organizationsService.deleteDelegation(
      user,
      organizationDelegationDto,
    )
  }
}
