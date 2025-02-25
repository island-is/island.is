import { Transaction } from 'sequelize/types'
import { Sequelize } from 'sequelize-typescript'

import { Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

import { MessageService, MessageType } from '@island.is/judicial-system/message'
import {
  EventNotificationType,
  EventType,
  User,
} from '@island.is/judicial-system/types'

import { CreateEventLogDto } from './dto/createEventLog.dto'
import { EventLog } from './models/eventLog.model'

const allowMultiple: EventType[] = [
  EventType.LOGIN,
  EventType.LOGIN_UNAUTHORIZED,
  EventType.LOGIN_BYPASS,
  EventType.LOGIN_BYPASS_UNAUTHORIZED,
  EventType.INDICTMENT_CONFIRMED,
]

const eventToNotificationMap: Partial<
  Record<EventType, EventNotificationType>
> = {
  INDICTMENT_SENT_TO_PUBLIC_PROSECUTOR:
    EventNotificationType.INDICTMENT_SENT_TO_PUBLIC_PROSECUTOR,
}

@Injectable()
export class EventLogService {
  constructor(
    @InjectModel(EventLog)
    private readonly eventLogModel: typeof EventLog,
    private readonly messageService: MessageService,
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
  ) {}

  async createWithUser(
    eventType: EventType,
    caseId: string,
    user: User,
    transaction?: Transaction,
  ): Promise<void> {
    await this.create(
      {
        eventType,
        caseId,
        nationalId: user.nationalId,
        userRole: user.role,
        userName: user.name,
        userTitle: user.title,
        institutionName: user.institution?.name,
      },
      transaction,
    )
  }

  async create(
    event: CreateEventLogDto,
    transaction?: Transaction,
  ): Promise<void> {
    const { eventType, caseId, userRole, nationalId, institutionName } = event

    if (!allowMultiple.includes(event.eventType)) {
      const where = Object.fromEntries(
        // The user name and title do not matter when checking for duplicates
        Object.entries({
          eventType,
          caseId,
          nationalId,
          userRole,
          institutionName,
        }).filter(([_, value]) => value !== undefined),
      )

      const eventExists = await this.eventLogModel.findOne({ where })

      if (eventExists) {
        return
      }
    }

    try {
      await this.eventLogModel.create({ ...event }, { transaction })
    } catch (error) {
      // Tolerate failure but log error
      this.logger.error('Failed to create event log', error)
    }

    if (caseId) {
      this.addEventNotificationToQueue(eventType, caseId)
    }
  }

  async loginMap(
    nationalIds: string[],
  ): Promise<Map<string, { latest: Date; count: number }>> {
    return this.eventLogModel
      .count({
        group: ['nationalId', 'institutionName'],
        attributes: [
          'nationalId',
          'institutionName',
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
              `${log.nationalId}-${log.institutionName}`,
              { latest: log.latest as Date, count: log.count },
            ]),
          ),
      )
  }

  // Sends events to queue for notification dispatch
  private addEventNotificationToQueue(eventType: EventType, caseId: string) {
    const notificationType = eventToNotificationMap[eventType]

    if (notificationType) {
      try {
        this.messageService.sendMessagesToQueue([
          {
            type: MessageType.EVENT_NOTIFICATION_DISPATCH,
            caseId: caseId,
            body: { type: notificationType },
          },
        ])
      } catch (error) {
        this.logger.error('Failed to send event notification to queue', error)
      }
    }
  }
}
