import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  VERSION_NEUTRAL,
} from '@nestjs/common'
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger'
import { ApplicationsService } from './applications.service'
import { ApplicationDto } from './models/dto/application.dto'
import { CreateApplicationDto } from './models/dto/createApplication.dto'

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
  @Get(':id')
  async getApplication(@Param('id') id: string): Promise<ApplicationDto> {
    return this.applicationsService.getApplication(id)
  }

  @ApiOperation({ summary: 'Create new application' })
  @ApiCreatedResponse({
    description: 'Create new application',
    type: ApplicationDto,
  })
  @ApiParam({ name: 'slug', type: String })
  @ApiBody({ type: CreateApplicationDto })
  @Post(':slug')
  async create(
    @Param('slug') slug: string,
    @Body() createApplicationDto: CreateApplicationDto,
  ): Promise<ApplicationDto> {
    return this.applicationsService.create(slug, createApplicationDto)
  }
}
