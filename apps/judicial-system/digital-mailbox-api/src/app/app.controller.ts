import { Controller, Get, Inject } from '@nestjs/common'
import { UseGuards } from '@nestjs/common'
import { ApiCreatedResponse } from '@nestjs/swagger'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

import { JwtAuthGuard } from './guards/auth.guard'
import { User } from './guards/user.decorator'
import { AppService } from './app.service'

@Controller('api')
@UseGuards(JwtAuthGuard)
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  @Get('test')
  @ApiCreatedResponse({ type: String, description: 'Test connection' })
  async test(@User() user: any): Promise<string> {
    this.logger.debug('Testing connection')

    console.log(user)
    return this.appService.testConnection(user.nationalId)
  }
}
