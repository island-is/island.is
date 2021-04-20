import { Controller, Get } from '@nestjs/common'

import { ApiOkResponse, ApiTags } from '@nestjs/swagger'

import { ApplicationService } from './application.service'
import { ApplicationModel } from './models'

@Controller('api')
@ApiTags('applications')
export class ApplicationController {
  constructor(private readonly applicationService: ApplicationService) {}

  @Get('applications')
  @ApiOkResponse({
    type: ApplicationModel,
    isArray: true,
    description: 'Gets all existing applications',
  })
  getAll(): Promise<ApplicationModel[]> {
    return this.applicationService.getAll()
  }
}
