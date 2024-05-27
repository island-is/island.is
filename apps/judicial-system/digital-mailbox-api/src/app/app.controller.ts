import { Controller, Get, Inject, Query, UseGuards } from '@nestjs/common'
import { ApiCreatedResponse } from '@nestjs/swagger'

import { type Logger, LOGGER_PROVIDER } from '@island.is/logging'

import type { User as TUser } from '@island.is/judicial-system/types'

import { JwtAuthGuard } from './guards/auth.guard'
import { User } from './guards/user.decorator'
import { CasesResponse } from './models/cases.response'
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
  async test(@User() user: Pick<TUser, 'nationalId'>): Promise<string> {
    this.logger.debug('Testing connection')

    return this.appService.testConnection(user.nationalId)
  }

  @Get('cases')
  @ApiCreatedResponse({ type: String, description: 'Get all cases' })
  async getAllCases(
    @User() user: Pick<TUser, 'nationalId'>,
    @Query() query?: { lang: string },
  ): Promise<CasesResponse[]> {
    this.logger.debug('Getting all cases')

    return this.appService.getCases(user.nationalId, query?.lang)
  }
}
