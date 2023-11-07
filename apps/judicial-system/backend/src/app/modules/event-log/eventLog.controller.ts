import { Body, Controller, Inject, Post, Req } from '@nestjs/common'
import { ApiCreatedResponse } from '@nestjs/swagger'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

import { EventType, User } from '@island.is/judicial-system/types'

import { DeliverDto } from './dto/deliver.dto'
import { EventLogService } from './eventLog.service'

@Controller('api/event-log')
export class EventLogController {
  constructor(
    private readonly eventLogService: EventLogService,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  @Post('log-login')
  @ApiCreatedResponse({ description: 'Logs user login in event log' })
  logLogin(@Body() user: User): Promise<void> {
    this.logger.debug('@!#$!@#!@#!@#!@#!@#!@#!@#!@#!@#!@#@!#,', user)

    return this.eventLogService.create({
      eventType: EventType.LOGIN,
      nationalId: user.nationalId,
    })
  }
}
