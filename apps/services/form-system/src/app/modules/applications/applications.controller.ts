import { Controller, Get, Param, Post } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { ApplicationsService } from './applications.service'
import { ApplicationDto } from './models/dto/application.dto'
import { Documentation } from '@island.is/nest/swagger'

@ApiTags('applications')
@Controller('applications')
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Get()
  @Documentation({
    description: 'Get application preview',
    response: { status: 200, type: ApplicationDto },
  })
  getPreview(@Param('formId') formId: string): ApplicationDto {
    return this.applicationsService.getPreview(formId)
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
