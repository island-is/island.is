import { Body, Controller, Post } from '@nestjs/common'
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger'
import { EventLogService } from './eventLog.service'
import { EventLog } from './models/eventLog.model'
import { CreateEventLogDto } from './dto/createEventLog.dto'

@Controller('api/eventLog')
@ApiTags('event-log')
export class EventLogController {
  constructor(private readonly eventLogService: EventLogService) {}

  @Post()
  @ApiCreatedResponse({
    type: EventLog,
    description: 'Creates a new event log',
  })
  create(@Body() eventLog: CreateEventLogDto): Promise<EventLog> {
    return this.eventLogService.create(eventLog)
  }
}
