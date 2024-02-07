import { Controller, Get, Headers, Inject, Query } from '@nestjs/common'
import { ApiCreatedResponse } from '@nestjs/swagger'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

import { FilterApplicationsDto } from './app.dto'
import { AppService } from './app.service'
import { ApplicationModel } from './models'

@Controller('api/v1')
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  @Get('applications')
  @ApiCreatedResponse({ description: 'Gets application for municipality' })
  async getApplication(
    @Headers('API-Key') apiKey: string,
    @Headers('Municipality-Code') municipalityCode: string,
    @Query() filters: FilterApplicationsDto,
  ): Promise<ApplicationModel[]> {
    this.logger.info('Gets all application')
    return this.appService
      .getApplications(apiKey, municipalityCode, filters)
      .then((applications) => {
        this.logger.info(`Application fetched`)
        return applications
      })
  }
}
