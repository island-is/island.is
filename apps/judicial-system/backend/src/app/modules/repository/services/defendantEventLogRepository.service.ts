import { Transaction } from 'sequelize'

import { Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import { type Logger, LOGGER_PROVIDER } from '@island.is/logging'

import { DefendantEventType, User } from '@island.is/judicial-system/types'

import { DefendantEventLog } from '../models/defendantEventLog.model'

interface CreateDefendantEventLogOptions {
  transaction: Transaction
}

@Injectable()
export class DefendantEventLogRepositoryService {
  constructor(
    @InjectModel(DefendantEventLog)
    private readonly defendantEventLogModel: typeof DefendantEventLog,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  async createWithUser(
    eventType: DefendantEventType,
    caseId: string,
    defendantId: string,
    user: User,
    transaction: Transaction,
  ): Promise<void> {
    await this.create(
      {
        eventType,
        caseId,
        defendantId,
        nationalId: user.nationalId,
        userRole: user.role,
        userName: user.name,
        userTitle: user.title,
        institutionName: user.institution?.name,
      },
      { transaction },
    )
  }

  async create(
    data: Partial<DefendantEventLog>,
    options: CreateDefendantEventLogOptions,
  ): Promise<DefendantEventLog> {
    try {
      this.logger.debug(
        `Creating a new defendant event log for defendant ${data.defendantId} of case ${data.caseId} with event type ${data.eventType}`,
      )

      const result = await this.defendantEventLogModel.create(data, options)

      this.logger.debug(
        `Created a new defendant event log ${result.id} for defendant ${data.defendantId} of case ${data.caseId}`,
      )

      return result
    } catch (error) {
      this.logger.error(
        `Error creating a new defendant event log for defendant ${data.defendantId} of case ${data.caseId} with event type ${data.eventType}:`,
        { error },
      )

      throw error
    }
  }
}
