import { Controller, Get, UseGuards } from '@nestjs/common'
import { ApiOkResponse, ApiTags } from '@nestjs/swagger'

import { apiBasePath } from '@island.is/financial-aid/shared/lib'

import { ApplicationModel } from '../application/models'
import { OpenApiApplicationService } from './openApiApplication.service'
import { ApiKeyGuard } from '../../guards/apiKey.guard'
import { CurrentMunicipalityCode } from '../../decorators/apiKey.decorator'

@Controller(`${apiBasePath}/open-api-applications`)
@UseGuards(ApiKeyGuard)
@ApiTags('application')
export class OpenApiApplicationController {
  constructor(private readonly applicationService: OpenApiApplicationService) {}

  @Get('getAll')
  @ApiOkResponse({
    type: ApplicationModel,
    isArray: true,
    description: 'Gets all existing applications',
  })
  async getAll(@CurrentMunicipalityCode() municipalityCode: string) {
    return this.applicationService.getAll(municipalityCode)
  }
}
