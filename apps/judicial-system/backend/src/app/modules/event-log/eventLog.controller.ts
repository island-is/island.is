import { Body, Controller, Inject, Post, UseGuards } from '@nestjs/common'
import { ApiCreatedResponse } from '@nestjs/swagger'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

import { TokenGuard } from '@island.is/judicial-system/auth'
import { EventType, User } from '@island.is/judicial-system/types'

import { EventLogService } from './eventLog.service'

@Controller('api/event-log')
export class EventLogController {
  constructor(
    private readonly eventLogService: EventLogService,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  @UseGuards(TokenGuard)
  @Post('log-login')
  @ApiCreatedResponse({ description: 'Logs user login in event log' })
  logLogin(@Body() user: User): Promise<void> {
    return this.eventLogService.create({
      eventType: EventType.LOGIN,
      nationalId: user.nationalId,
    })
  }
}
