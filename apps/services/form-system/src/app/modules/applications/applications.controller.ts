import { Controller, Get, Param, Post, VERSION_NEUTRAL } from '@nestjs/common'
import {
  ApiCreatedResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger'
import { ApplicationsService } from './applications.service'
import { ApplicationDto } from './models/dto/application.dto'

@ApiTags('applications')
@Controller({ path: 'applications', version: ['1', VERSION_NEUTRAL] })
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @ApiOperation({ summary: 'Get an application by id' })
  @ApiCreatedResponse({
    description: 'Get an application by id',
    type: ApplicationDto,
  })
  @ApiParam({ name: 'id', type: String })
  @Get()
  async getApplication(@Param('id') id: string): Promise<ApplicationDto> {
    return this.applicationsService.getApplication(id)
  }

  @ApiOperation({ summary: 'Create new application' })
  @ApiCreatedResponse({
    description: 'Create new application',
    type: ApplicationDto,
  })
  @ApiParam({ name: 'slug', type: String })
  @Post(':slug')
  async create(@Param('slug') slug: string): Promise<ApplicationDto> {
    return this.applicationsService.create(slug)
  }
}
