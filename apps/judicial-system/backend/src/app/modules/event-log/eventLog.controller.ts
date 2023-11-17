import { Body, Controller, Inject, Post, UseGuards } from '@nestjs/common'
import { ApiCreatedResponse } from '@nestjs/swagger'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

import { TokenGuard } from '@island.is/judicial-system/auth'

import { CreateEventLogDto } from './dto/createEventLog.dto'
import { EventLogService } from './eventLog.service'

@Controller('api/event-log')
export class EventLogController {
  constructor(
    private readonly eventLogService: EventLogService,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  @UseGuards(TokenGuard)
  @Post('log-event')
  @ApiCreatedResponse({ description: 'Logs an event to event log' })
  logEvent(@Body() event: CreateEventLogDto): Promise<void> {
    return this.eventLogService.create(event)
  }
}
