import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import { EventLog } from './models/eventLog.model'
import { CreateEventLogDto } from './dto/createEventLog.dto'

@Injectable()
export class EventLogService {
  constructor(
    @InjectModel(EventLog)
    private readonly eventLogModel: typeof EventLog,
  ) {}

  async create(event: CreateEventLogDto): Promise<EventLog> {
    const { eventType, caseId, userRole, nationalId } = event

    const where = Object.fromEntries(
      Object.entries({ caseId, eventType, nationalId, userRole }).filter(
        ([_, value]) => value !== undefined,
      ),
    )

    const eventExists = await this.eventLogModel.findOne({ where })

    if (eventExists) {
      return eventExists
    }

    return this.eventLogModel.create({
      eventType,
      caseId,
      nationalId,
      userRole,
    })
  }

  async findByCaseId(caseId: string): Promise<EventLog[]> {
    return this.eventLogModel.findAll({
      where: { caseId },
    })
  }
}
