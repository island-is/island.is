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
  EventType.COURT_DATE_SCHEDULED,
]

const eventToNotificationMap: Partial<
  Record<EventType, EventNotificationType>
> = {
  INDICTMENT_SENT_TO_PUBLIC_PROSECUTOR:
    EventNotificationType.INDICTMENT_SENT_TO_PUBLIC_PROSECUTOR,
  COURT_DATE_SCHEDULED: EventNotificationType.COURT_DATE_SCHEDULED,
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
        user,
      },
      transaction,
    )
  }

  async create(
    event: CreateEventLogDto,
    transaction?: Transaction,
  ): Promise<boolean> {
    const { eventType, caseId, user } = event
    const {
      role: userRole,
      nationalId,
      name: userName,
      title: userTitle,
      institution,
    } = user
    const institutionName = institution?.name

    const eventLog = {
      eventType,
      caseId,
      nationalId,
      userRole,
      userName,
      userTitle,
      institutionName,
    }

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
        return true
      }
    }

    try {
      await this.eventLogModel.create(eventLog, { transaction })

      return true
    } catch (error) {
      // Tolerate failure but log error
      this.logger.error('Failed to create event log', error)

      return false
    } finally {
      if (caseId) {
        this.addEventNotificationToQueue(eventType, caseId, user)
      }
    }
  }

  async loginMap(
    nationalIds: string[],
  ): Promise<Map<string, { latest: Date; count: number }>> {
    return this.eventLogModel
      .count({
        group: ['nationalId', 'userRole', 'institutionName'],
        attributes: [
          'nationalId',
          'userRole',
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
              `${log.nationalId}-${log.userRole}-${log.institutionName}`,
              { latest: log.latest as Date, count: log.count },
            ]),
          ),
      )
  }

  // Sends events to queue for notification dispatch
  private addEventNotificationToQueue(
    eventType: EventType,
    caseId: string,
    user: User,
  ) {
    const notificationType = eventToNotificationMap[eventType]

    if (notificationType) {
      console.log('TESTING3')
      console.log({ eventType, caseId, user })
      try {
        this.messageService.sendMessagesToQueue([
          {
            type: MessageType.EVENT_NOTIFICATION_DISPATCH,
            user,
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
