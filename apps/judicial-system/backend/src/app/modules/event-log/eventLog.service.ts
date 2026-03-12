import { Transaction } from 'sequelize'
import { Sequelize } from 'sequelize-typescript'

import { Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

import {
  addMessagesToQueue,
  MessageType,
} from '@island.is/judicial-system/message'
import {
  EventNotificationType,
  EventType,
  User,
  UserDescriptor,
} from '@island.is/judicial-system/types'

import { EventLog } from '../repository'
import { CreateEventLogDto } from './dto/createEventLog.dto'

const allowMultiple: EventType[] = [
  EventType.LOGIN,
  EventType.LOGIN_UNAUTHORIZED,
  EventType.LOGIN_BYPASS,
  EventType.LOGIN_BYPASS_UNAUTHORIZED,
  EventType.INDICTMENT_CONFIRMED,
  EventType.COURT_DATE_SCHEDULED,
  EventType.INDICTMENT_CRIMINAL_RECORD_UPDATED_BY_COURT,
  EventType.REQUEST_COMPLETED,
  EventType.INDICTMENT_SENT_TO_PUBLIC_PROSECUTOR,
  EventType.INDICTMENT_COMPLETED,
]

const allowOnePerUserRole: EventType[] = [EventType.APPEAL_RESULT_ACCESSED]

const eventToNotificationMap: Partial<
  Record<EventType, EventNotificationType>
> = {
  INDICTMENT_SENT_TO_PUBLIC_PROSECUTOR:
    EventNotificationType.INDICTMENT_SENT_TO_PUBLIC_PROSECUTOR,
  INDICTMENT_CRIMINAL_RECORD_UPDATED_BY_COURT:
    EventNotificationType.INDICTMENT_CRIMINAL_RECORD_UPDATED_BY_COURT,
  COURT_DATE_SCHEDULED: EventNotificationType.COURT_DATE_SCHEDULED,
}

@Injectable()
export class EventLogService {
  constructor(
    @InjectModel(EventLog)
    private readonly eventLogModel: typeof EventLog,
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
  ): Promise<boolean> {
    const { eventType, caseId, userName, userRole, institutionName } = event

    if (!allowMultiple.includes(event.eventType)) {
      const where = Object.fromEntries(
        // The user name and title do not matter when checking for duplicates
        Object.entries({
          eventType,
          caseId,
          userRole: allowOnePerUserRole.includes(eventType)
            ? userRole
            : undefined,
        }).filter(([_, value]) => value !== undefined),
      )

      const eventExists = await this.eventLogModel.findOne({
        where,
        transaction,
      })

      if (eventExists) {
        return true
      }
    }

    try {
      await this.eventLogModel.create({ ...event }, { transaction })

      return true
    } catch (error) {
      // Tolerate failure but log error
      this.logger.error('Failed to create event log', error)

      return false
    } finally {
      if (caseId) {
        this.addMessagesForEventNotificationToQueue({
          eventType,
          caseId,
          userDescriptor: {
            name: userName,
            institution: { name: institutionName },
          },
        })
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
  private addMessagesForEventNotificationToQueue({
    eventType,
    caseId,
    userDescriptor,
  }: {
    eventType: EventType
    caseId: string
    userDescriptor: UserDescriptor
  }) {
    const notificationType = eventToNotificationMap[eventType]

    if (notificationType) {
      addMessagesToQueue({
        type: MessageType.EVENT_NOTIFICATION_DISPATCH,
        caseId: caseId,
        // There is a user property defined in the Message type definition, but
        // in the event log service we won't always have a registered user with required props (e.g. user id)
        // Thus we refrain from passing down the user instance in the event service
        body: { type: notificationType, userDescriptor },
      })
    }
  }
}
