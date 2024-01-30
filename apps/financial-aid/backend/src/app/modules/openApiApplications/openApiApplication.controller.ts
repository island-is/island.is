import { Controller, Get } from '@nestjs/common'
import { ApiOkResponse, ApiTags } from '@nestjs/swagger'

import { apiBasePath } from '@island.is/financial-aid/shared/lib'

import { ApplicationModel } from '../application/models'
import { OpenApiApplicationService } from './openApiApplication.service'

@Controller(`${apiBasePath}/open-api-applications`)
@ApiTags('application')
export class OpenApiApplicationController {
  constructor(private readonly applicationService: OpenApiApplicationService) {}

  @Get('getAll')
  @ApiOkResponse({
    type: ApplicationModel,
    isArray: true,
    description: 'Gets all existing applications',
  })
  async getAll() {
    console.log('helooo')
    return this.applicationService.getAll()
  }
}
