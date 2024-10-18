import {
  Body,
  Controller,
  Post,
  Get,
  Param,
  NotFoundException,
  VERSION_NEUTRAL,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { OrganizationsService } from './organizations.service'
import { CreateOrganizationDto } from './models/dto/createOrganization.dto'
import { Documentation } from '@island.is/nest/swagger'
import { OrganizationsResponseDto } from './models/dto/organizations.response.dto'
import { OrganizationDto } from './models/dto/organization.dto'

@ApiTags('organizations')
@Controller({ path: 'organizations', version: ['1', VERSION_NEUTRAL] })
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) {}

  @Post()
  create(
    @Body() createOrganizationDto: CreateOrganizationDto,
  ): Promise<OrganizationDto> {
    return this.organizationsService.create(createOrganizationDto)
  }

  @Get()
  @Documentation({
    description: 'Get all Organizations',
    response: { status: 200, type: [OrganizationsResponseDto] },
  })
  async findAll(): Promise<OrganizationsResponseDto> {
    return await this.organizationsService.findAll()
  }

  @Get(':id')
  @Documentation({
    description: 'Get Organization by id',
    response: { status: 200, type: OrganizationDto },
  })
  async findOne(@Param('id') id: string): Promise<OrganizationDto> {
    const organization = await this.organizationsService.findOne(id)
    if (!organization) {
      throw new NotFoundException(`Organization not found`)
    }

    return organization
  }
}
