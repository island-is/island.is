import { Controller, Get, Param, Post, VERSION_NEUTRAL } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { ApplicationsService } from './applications.service'
import { ApplicationDto } from './models/dto/application.dto'
import { Documentation } from '@island.is/nest/swagger'

@ApiTags('applications')
@Controller({ path: 'applications', version: ['1', VERSION_NEUTRAL] })
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Get()
  @Documentation({
    description: 'Get application',
    response: { status: 200, type: ApplicationDto },
  })
  async getPreview(
    @Param('applicationId') applicationId: string,
  ): Promise<ApplicationDto> {
    return this.applicationsService.getApplication(applicationId)
  }

  @Documentation({
    description: 'Create new application',
    response: { status: 200, type: ApplicationDto },
  })
  @Post(':slug')
  async create(@Param('slug') slug: string): Promise<ApplicationDto> {
    return this.applicationsService.create(slug)
  }
}
