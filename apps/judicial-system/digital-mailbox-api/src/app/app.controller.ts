import { Controller, Get, Headers, Inject, Req } from '@nestjs/common'
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
  async test(@Headers('authorization') authToken: string): Promise<string> {
    this.logger.debug('Testing connection')
    const token = authToken.split(' ')[1]

    return this.appService.testConnection(token)
  }
}
