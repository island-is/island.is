import { Controller, Get, Inject, UseInterceptors } from '@nestjs/common'
import { ApiCreatedResponse } from '@nestjs/swagger'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

import { EventInterceptor } from './app.interceptor'
import { AppService } from './app.service'

@Controller('api/v1')
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  @UseInterceptors(EventInterceptor)
  @Get('test')
  @ApiCreatedResponse({ type: String, description: 'Test connection' })
  async test(): Promise<string> {
    this.logger.debug('Testing connection')

    return this.appService.testConnection()
  }
}
