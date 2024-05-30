import { Transaction } from 'sequelize/types'
import { Sequelize } from 'sequelize-typescript'

import { Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

import { EventType } from '@island.is/judicial-system/types'

import { CreateEventLogDto } from './dto/createEventLog.dto'
import { EventLog } from './models/eventLog.model'

const allowMultiple: EventType[] = [
  EventType.LOGIN,
  EventType.LOGIN_UNAUTHORIZED,
  EventType.LOGIN_BYPASS,
  EventType.LOGIN_BYPASS_UNAUTHORIZED,
  EventType.INDICTMENT_CONFIRMED,
]

@Injectable()
export class EventLogService {
  constructor(
    @InjectModel(EventLog)
    private readonly eventLogModel: typeof EventLog,
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
  ) {}

  async create(
    event: CreateEventLogDto,
    transaction?: Transaction,
  ): Promise<void> {
    const { eventType, caseId, userRole, nationalId } = event

    if (!allowMultiple.includes(event.eventType)) {
      const where = Object.fromEntries(
        Object.entries({ caseId, eventType, nationalId, userRole }).filter(
          ([_, value]) => value !== undefined,
        ),
      )

      const eventExists = await this.eventLogModel.findOne({ where })

      if (eventExists) {
        return
      }
    }

    try {
      await this.eventLogModel.create(
        { eventType, caseId, nationalId, userRole },
        { transaction },
      )
    } catch (error) {
      // Tolerate failure but log error
      this.logger.error('Failed to create event log', error)
    }
  }

  async loginMap(
    nationalIds: string[],
  ): Promise<Map<string, { latest: Date; count: number }>> {
    return this.eventLogModel
      .count({
        group: ['nationalId'],
        attributes: [
          'nationalId',
          [Sequelize.fn('max', Sequelize.col('created')), 'latest'],
          [Sequelize.fn('count', Sequelize.col('national_id')), 'count'],
        ],
        where: {
          eventType: ['LOGIN', 'LOGIN_BYPASS'],
          nationalId: nationalIds,
        },
      })
      .then(
        (logs) =>
          new Map(
            logs.map((log) => [
              log.nationalId as string,
              { latest: log.latest as Date, count: log.count },
            ]),
          ),
      )
  }
}
