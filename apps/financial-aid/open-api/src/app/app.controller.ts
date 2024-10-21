import { Controller, Get, Headers, Inject, Param, Query } from '@nestjs/common'
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
    this.logger.info('Gets all application')
    return this.appService
      .getApplications(apiKey, municipalityCode, filters)
      .then((applications) => {
        this.logger.info(`Application fetched`)
        return applications
      })
  }

  @Get('pdf')
  @ApiCreatedResponse({
    type: [ApplicationBackendModel],
    description: 'Gets application',
  })
  async getPdf(
    @Headers('API-Key') apiKey: string,
    @Headers('Municipality-Code') municipalityCode: string,
    @Query('id') id: string,
  ): Promise<ApplicationModel> {
    this.logger.info('Gets one application and returns pdf')
    return this.appService
      .getApplication(apiKey, municipalityCode, id)
      .then((application) => {
        this.logger.info(`Application fetched`)
        return application
      })
  }
}
