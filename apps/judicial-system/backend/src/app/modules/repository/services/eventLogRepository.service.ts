import { col, fn, Transaction } from 'sequelize'

import { Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import { type Logger, LOGGER_PROVIDER } from '@island.is/logging'

import { EventType, UserRole } from '@island.is/judicial-system/types'

import { EventLog } from '../models/eventLog.model'

export type CreateEventLog = {
  eventType: EventType
  caseId?: string
  nationalId?: string
  userRole?: UserRole
  userName?: string
  userTitle?: string
  institutionName?: string
}

interface EventLogTransactionOptions {
  transaction?: Transaction
}

// One row per (national id, user role, institution) group, as counted by
// countLoginsByNationalIds. The caller decides how to key it.
export type LoginCount = {
  nationalId?: string
  userRole?: UserRole
  institutionName?: string
  latest: Date
  count: number
}

@Injectable()
export class EventLogRepositoryService {
  constructor(
    @InjectModel(EventLog) private readonly eventLogModel: typeof EventLog,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  // eventType comes first because every other part of the key is optional: an
  // event without a case id, or one whose type does not discriminate on user
  // role, matches on the narrower key.
  async existsForCaseAndType(
    eventType: EventType,
    caseId?: string,
    userRole?: UserRole,
    options?: EventLogTransactionOptions,
  ): Promise<boolean> {
    try {
      this.logger.debug(
        `Checking for a ${eventType} event log for case ${caseId}`,
      )

      const eventLog = await this.eventLogModel.findOne({
        where: {
          eventType,
          ...(caseId === undefined ? {} : { caseId }),
          ...(userRole === undefined ? {} : { userRole }),
        },
        transaction: options?.transaction,
      })

      return Boolean(eventLog)
    } catch (error) {
      this.logger.error(
        `Error checking for a ${eventType} event log for case ${caseId}:`,
        { error },
      )

      throw error
    }
  }

  async create(
    event: CreateEventLog,
    options?: EventLogTransactionOptions,
  ): Promise<EventLog> {
    try {
      this.logger.debug(
        `Creating a ${event.eventType} event log for case ${event.caseId}`,
      )

      return await this.eventLogModel.create(
        { ...event },
        { transaction: options?.transaction },
      )
    } catch (error) {
      this.logger.error(
        `Error creating a ${event.eventType} event log for case ${event.caseId}:`,
        { error },
      )

      throw error
    }
  }

  async countLoginsByNationalIds(nationalIds: string[]): Promise<LoginCount[]> {
    try {
      this.logger.debug(`Counting logins for ${nationalIds.length} user(s)`)

      const logins = await this.eventLogModel.count({
        group: ['nationalId', 'userRole', 'institutionName'],
        attributes: [
          'nationalId',
          'userRole',
          'institutionName',
          [fn('max', col('created')), 'latest'],
          [fn('count', col('national_id')), 'count'],
        ],
        where: {
          eventType: [EventType.LOGIN, EventType.LOGIN_BYPASS],
          nationalId: nationalIds,
        },
      })

      return logins.map((login) => ({
        nationalId: login.nationalId as string,
        userRole: login.userRole as UserRole,
        institutionName: login.institutionName as string,
        latest: login.latest as Date,
        count: login.count,
      }))
    } catch (error) {
      this.logger.error(
        `Error counting logins for ${nationalIds.length} user(s):`,
        { error },
      )

      throw error
    }
  }
}
