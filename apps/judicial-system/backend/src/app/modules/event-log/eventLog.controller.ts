import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger'

import { TokenGuard } from '@island.is/judicial-system/auth'

import { CreateEventLogDto } from './dto/createEventLog.dto'
import { EventLogService } from './eventLog.service'

@Controller('api/eventLog')
@ApiTags('eventLogs')
@UseGuards(TokenGuard)
export class EventLogController {
  constructor(private readonly eventLogService: EventLogService) {}

  @Post('event')
  @ApiCreatedResponse({ description: 'Logs an event to event log' })
  logEvent(@Body() event: CreateEventLogDto): Promise<boolean> {
    return this.eventLogService.create(event)
  }
}
