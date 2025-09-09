import {
  Body,
  Controller,
  Post,
  Get,
  Param,
  NotFoundException,
  VERSION_NEUTRAL,
  UseGuards,
} from '@nestjs/common'
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger'
import { OrganizationsService } from './organizations.service'
import { CreateOrganizationDto } from './models/dto/createOrganization.dto'
import { OrganizationsResponseDto } from './models/dto/organizations.response.dto'
import { OrganizationDto } from './models/dto/organization.dto'
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

  @ApiOperation({ summary: 'Create an organization' })
  @ApiCreatedResponse({
    description: 'Create an organization',
    type: OrganizationDto,
  })
  @ApiBody({ type: CreateOrganizationDto })
  @Post()
  create(
    @Body() createOrganizationDto: CreateOrganizationDto,
  ): Promise<OrganizationDto> {
    return this.organizationsService.create(createOrganizationDto)
  }

  @ApiOperation({ summary: 'Get all Organizations' })
  @ApiOkResponse({
    description: 'Get all Organizations',
    type: OrganizationsResponseDto,
  })
  @Get()
  async findAll(): Promise<OrganizationsResponseDto> {
    return await this.organizationsService.findAll()
  }

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

  @ApiOperation({ summary: 'Get an organization by id' })
  @ApiOkResponse({
    description: 'Get an organization by id',
    type: OrganizationDto,
  })
  @ApiParam({ name: 'id', type: String })
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<OrganizationDto> {
    const organization = await this.organizationsService.findOne(id)
    if (!organization) {
      throw new NotFoundException(`Organization not found`)
    }

    return organization
  }
}
