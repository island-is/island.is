import { Controller, Get, Inject, Query } from '@nestjs/common'
import { ApiCreatedResponse } from '@nestjs/swagger'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

import { AppService } from './app.service'

@Controller('api')
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  @Get('test')
  @ApiCreatedResponse({ type: String, description: 'Test connection' })
  async test(): Promise<string> {
    this.logger.debug('Testing connection')

    return this.appService.testConnection()
  }

  @Get('cases')
  @ApiCreatedResponse({ type: String, description: 'Get all cases' })
  async getAllCases(@Query() query?: { lang: string }): Promise<any[]> {
    this.logger.debug('Getting all cases')

    return this.appService.getCases(query?.lang)
  }
}
