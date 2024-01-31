import { Controller, Get, Inject, UseGuards } from '@nestjs/common'
import { ApiOkResponse, ApiTags } from '@nestjs/swagger'

import { apiBasePath } from '@island.is/financial-aid/shared/lib'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { ApplicationModel } from '../application/models'
import { OpenApiApplicationService } from './openApiApplication.service'
import { ApiKeyGuard } from '../../guards/apiKey.guard'
import { CurrentMunicipalityCode } from '../../decorators/apiKey.decorator'

@Controller(`${apiBasePath}/open-api-applications`)
@UseGuards(ApiKeyGuard)
@ApiTags('application')
export class OpenApiApplicationController {
  constructor(
    private readonly applicationService: OpenApiApplicationService,
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
  ) {}

  @Get('getAll')
  @ApiOkResponse({
    type: ApplicationModel,
    isArray: true,
    description: 'Gets all existing applications',
  })
  async getAll(@CurrentMunicipalityCode() municipalityCode: string) {
    this.logger.info(`${municipalityCode} fetched all applications`)
    return this.applicationService.getAll(municipalityCode)
  }
}
