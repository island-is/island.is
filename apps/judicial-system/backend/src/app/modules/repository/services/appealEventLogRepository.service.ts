import { Transaction } from 'sequelize'

import { Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import { type Logger, LOGGER_PROVIDER } from '@island.is/logging'

import { AppealEventLog } from '../models/appealEventLog.model'

interface CreateAppealEventLogOptions {
  transaction: Transaction
}

@Injectable()
export class AppealEventLogRepositoryService {
  constructor(
    @InjectModel(AppealEventLog)
    private readonly appealEventLogModel: typeof AppealEventLog,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  async create(
    data: Partial<AppealEventLog>,
    options: CreateAppealEventLogOptions,
  ): Promise<AppealEventLog> {
    try {
      this.logger.debug(
        `Creating a new appeal event log for appeal case ${data.appealCaseId} with event type ${data.eventType} and user role ${data.userRole}`,
      )

      const result = await this.appealEventLogModel.create(data, options)

      this.logger.debug(
        `Created a new appeal event log ${result.id} for appeal case ${data.appealCaseId}`,
      )

      return result
    } catch (error) {
      this.logger.error(
        `Error creating a new appeal event log for appeal case ${data.appealCaseId} with event type ${data.eventType}:`,
        { error },
      )

      throw error
    }
  }
}
