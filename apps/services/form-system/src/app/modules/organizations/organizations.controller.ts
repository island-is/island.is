import {
  Body,
  Controller,
  Post,
  Get,
  Param,
  NotFoundException,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { OrganizationsService } from './organizations.service'
import { Organization } from './models/organization.model'
import { CreateOrganizationDto } from './models/dto/createOrganization.dto'
import { Documentation } from '@island.is/nest/swagger'

@ApiTags('organizations')
@Controller('organizations')
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) {}

  @Post()
  create(
    @Body() createOrganizationDto: CreateOrganizationDto,
  ): Promise<Organization> {
    return this.organizationsService.create(createOrganizationDto)
  }

  @Get()
  @Documentation({
    description: 'Get all Organizations',
    response: { status: 200, type: [Organization] },
  })
  async findAll(): Promise<Organization[]> {
    return await this.organizationsService.findAll()
  }

  @Get(':id')
  @Documentation({
    description: 'Get Organization by id',
    response: { status: 200, type: Organization },
  })
  async findOne(@Param('id') id: string): Promise<Organization> {
    const form = await this.organizationsService.findOne(id)
    if (!form) {
      throw new NotFoundException(`Organization not found`)
    }

    return form
  }
}
