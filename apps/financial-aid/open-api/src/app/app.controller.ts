import {
  BadRequestException,
  Controller,
  Get,
  Headers,
  Inject,
  Query,
} from '@nestjs/common'
import { ApiCreatedResponse } from '@nestjs/swagger'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

import { FilterApplicationsDto } from './app.dto'
import { AppService } from './app.service'
import { ApplicationBackendModel } from './backendModels'
import { ApplicationModel } from './models'

@Controller('api/open/v1')
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  @Get('applications')
  @ApiCreatedResponse({
    type: [ApplicationBackendModel],
    description: 'Gets application for municipality',
  })
  async getApplication(
    @Headers('API-Key') apiKey: string,
    @Headers('Municipality-Code') municipalityCode: string,
    @Query() filters: FilterApplicationsDto,
  ): Promise<ApplicationModel[]> {
    if (!apiKey && !municipalityCode) {
      throw new BadRequestException('API-Key and Municipality-Code are missing')
    }
    if (!apiKey) {
      throw new BadRequestException('API-Key is missing')
    }
    if (!municipalityCode) {
      throw new BadRequestException('Municipality-Code is missing')
    }

    this.logger.info('Gets all application')
    return this.appService
      .getApplications(apiKey, municipalityCode, filters)
      .then((applications) => {
        this.logger.info(`Application fetched`)
        return applications
      })
  }
}
