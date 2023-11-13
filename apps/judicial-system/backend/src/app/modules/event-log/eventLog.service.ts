import { Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

import { CreateEventLogDto } from './dto/createEventLog.dto'
import { EventLog } from './models/eventLog.model'

@Injectable()
export class EventLogService {
  constructor(
    @InjectModel(EventLog)
    private readonly eventLogModel: typeof EventLog,
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
  ) {}

  async create(event: CreateEventLogDto): Promise<void> {
    const { eventType, caseId, userRole, nationalId } = event
    const allowMultiple = ['LOGIN']

    const where = Object.fromEntries(
      Object.entries({ caseId, eventType, nationalId, userRole }).filter(
        ([_, value]) => value !== undefined,
      ),
    )

    const eventExists = await this.eventLogModel.findOne({ where })

    if (!allowMultiple.includes(event.eventType) && eventExists) {
      return
    }

    try {
      await this.eventLogModel.create({
        eventType,
        caseId,
        nationalId,
        userRole,
      })
    } catch (error) {
      this.logger.error('Failed to create event log', error)
    }
  }
}
