import { CreateOptions, Transaction } from 'sequelize'

import { Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import { type Logger, LOGGER_PROVIDER } from '@island.is/logging'

import { DefendantEventLog } from '../models/defendantEventLog.model'

interface CreateDefendantEventLogOptions {
  transaction?: Transaction
}

@Injectable()
export class DefendantEventLogRepositoryService {
  constructor(
    @InjectModel(DefendantEventLog)
    private readonly defendantEventLogModel: typeof DefendantEventLog,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  async create(
    data: Partial<DefendantEventLog>,
    options?: CreateDefendantEventLogOptions,
  ): Promise<DefendantEventLog> {
    try {
      this.logger.debug(
        `Creating a new defendant event log for defendant ${data.defendantId} of case ${data.caseId} with event type ${data.eventType}`,
      )

      const createOptions: CreateOptions = {}

      if (options?.transaction) {
        createOptions.transaction = options.transaction
      }

      const result = await this.defendantEventLogModel.create(
        data,
        createOptions,
      )

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
