import { Body, Controller, Inject, Post, UseGuards } from '@nestjs/common'
import { ApiCreatedResponse } from '@nestjs/swagger'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

import { TokenGuard } from '@island.is/judicial-system/auth'

import { CreateDateLogDto } from './dto/createDateLog.dto'
import { DateLogService } from './dateLog.service'

@Controller('api/date-log')
export class DateLogController {
  constructor(
    private readonly dateLogService: DateLogService,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  @UseGuards(TokenGuard)
  @Post('log-date')
  @ApiCreatedResponse({ description: 'Logs an date to date log' })
  logEvent(@Body() date: CreateDateLogDto): Promise<void> {
    return this.dateLogService.create(date)
  }
}
