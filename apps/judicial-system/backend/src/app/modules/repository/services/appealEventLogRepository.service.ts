import { Transaction } from 'sequelize'

import { Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import { type Logger, LOGGER_PROVIDER } from '@island.is/logging'

import { AppealEventType } from '@island.is/judicial-system/types'

import { AppealEventLog } from '../models/appealEventLog.model'

@Injectable()
export class AppealEventLogRepositoryService {
  constructor(
    @InjectModel(AppealEventLog)
    private readonly appealEventLogModel: typeof AppealEventLog,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  // Every event of an appeal case, of any type.
  async findAllForAppealCase(
    appealCaseId: string,
    options: { transaction: Transaction },
  ): Promise<AppealEventLog[]> {
    try {
      this.logger.debug(
        `Finding appeal event logs for appeal case ${appealCaseId}`,
      )

      const result = await this.appealEventLogModel.findAll({
        where: { appealCaseId },
        transaction: options.transaction,
      })

      this.logger.debug(
        `Found ${result.length} appeal event log(s) for appeal case ${appealCaseId}`,
      )

      return result
    } catch (error) {
      this.logger.error(
        `Error finding appeal event logs for appeal case ${appealCaseId}:`,
        { error },
      )

      throw error
    }
  }

  // The APPEALED events of an appeal case - one per party appeal, whether filed
  // by the party itself or created from an in-court appeal decision.
  async findAppealedEventsForAppealCase(
    appealCaseId: string,
    options: { transaction: Transaction },
  ): Promise<AppealEventLog[]> {
    try {
      this.logger.debug(
        `Finding APPEALED event logs for appeal case ${appealCaseId}`,
      )

      const result = await this.appealEventLogModel.findAll({
        where: { appealCaseId, eventType: AppealEventType.APPEALED },
        transaction: options.transaction,
      })

      this.logger.debug(
        `Found ${result.length} APPEALED event log(s) for appeal case ${appealCaseId}`,
      )

      return result
    } catch (error) {
      this.logger.error(
        `Error finding APPEALED event logs for appeal case ${appealCaseId}:`,
        { error },
      )

      throw error
    }
  }

  async create(
    data: Partial<AppealEventLog>,
    options: { transaction: Transaction },
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

  // Removes every event log of an appeal case - used before the appeal case
  // itself is deleted (the event logs reference it via a foreign key).
  async deleteByAppealCaseId(
    appealCaseId: string,
    options: { transaction: Transaction },
  ): Promise<number> {
    try {
      this.logger.debug(
        `Deleting appeal event logs for appeal case ${appealCaseId}`,
      )

      const numberOfDeletedRows = await this.appealEventLogModel.destroy({
        where: { appealCaseId },
        transaction: options.transaction,
      })

      this.logger.debug(
        `Deleted ${numberOfDeletedRows} appeal event log(s) for appeal case ${appealCaseId}`,
      )

      return numberOfDeletedRows
    } catch (error) {
      this.logger.error(
        `Error deleting appeal event logs for appeal case ${appealCaseId}:`,
        { error },
      )

      throw error
    }
  }

  // Removes specific event log rows by id - used to converge an appeal case's
  // APPEALED events with its current in-court appellants (dropping rows for
  // parties that withdrew or were corrected away).
  async deleteByIds(
    ids: string[],
    options: { transaction: Transaction },
  ): Promise<number> {
    if (ids.length === 0) {
      return 0
    }

    try {
      this.logger.debug(`Deleting ${ids.length} appeal event log(s) by id`)

      const numberOfDeletedRows = await this.appealEventLogModel.destroy({
        where: { id: ids },
        transaction: options.transaction,
      })

      this.logger.debug(`Deleted ${numberOfDeletedRows} appeal event log(s)`)

      return numberOfDeletedRows
    } catch (error) {
      this.logger.error(`Error deleting appeal event logs by id:`, { error })

      throw error
    }
  }
}
