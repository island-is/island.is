import { Controller, Get, Headers, Inject } from '@nestjs/common'
import { ApiCreatedResponse } from '@nestjs/swagger'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

import { AppService } from './app.service'

@Controller('api/v1')
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  @Get('applications')
  @ApiCreatedResponse({ description: 'Gets application' })
  async getApplication(@Headers('api-key') apiKey: string) {
    this.logger.debug('Gets application')

    return this.appService.getApplications(apiKey).then((applications) => {
      this.logger.info(`Application fetched`)
      return applications
    })
  }
}
