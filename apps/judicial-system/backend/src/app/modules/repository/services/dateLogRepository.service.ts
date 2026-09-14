import { Transaction } from 'sequelize'

import { Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import { type Logger, LOGGER_PROVIDER } from '@island.is/logging'

import { DateType } from '@island.is/judicial-system/types'

import { DateLog } from '../models/dateLog.model'

// A date log is addressed by (caseId, dateType) - the table has a composite
// UNIQUE on the pair (unique_date_log_case_id_date_type) - so both key columns
// are named parameters rather than a caller-supplied where clause.
//
// The two value columns are optional because UpdateCaseDto declares them so.
// Create and update take the same shape, since the caller forwards the same
// nested DTO object on both paths; they are named separately so that tightening
// one (date is NOT NULL in the table) does not have to rename the other.
export type UpdateDateLog = {
  date?: Date
  location?: string
}

export type CreateDateLog = UpdateDateLog

@Injectable()
export class DateLogRepositoryService {
  constructor(
    @InjectModel(DateLog) private readonly dateLogModel: typeof DateLog,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  async findByCaseAndType(
    caseId: string,
    dateType: DateType,
    options: { transaction: Transaction },
  ): Promise<DateLog | null> {
    try {
      this.logger.debug(
        `Finding date log of type ${dateType} for case ${caseId}`,
      )

      const result = await this.dateLogModel.findOne({
        where: { caseId, dateType },
        transaction: options.transaction,
      })

      this.logger.debug(
        `Date log of type ${dateType} for case ${caseId} ${
          result ? 'found' : 'not found'
        }`,
      )

      return result
    } catch (error) {
      this.logger.error(
        `Error finding date log of type ${dateType} for case ${caseId}:`,
        { error },
      )

      throw error
    }
  }

  async createForCase(
    caseId: string,
    dateType: DateType,
    dateLog: CreateDateLog,
    options: { transaction: Transaction },
  ): Promise<DateLog> {
    try {
      this.logger.debug(
        `Creating a date log of type ${dateType} for case ${caseId}`,
      )

      return await this.dateLogModel.create(
        { caseId, dateType, ...dateLog },
        { transaction: options.transaction },
      )
    } catch (error) {
      this.logger.error(
        `Error creating a date log of type ${dateType} for case ${caseId}:`,
        { error },
      )

      throw error
    }
  }

  // The row count is not reported: the key identifies at most one row, and the
  // only caller has just read it. Add a result when a caller needs one.
  async updateByCaseAndType(
    caseId: string,
    dateType: DateType,
    update: UpdateDateLog,
    options: { transaction: Transaction },
  ): Promise<void> {
    try {
      this.logger.debug(
        `Updating date log of type ${dateType} for case ${caseId} with data:`,
        { data: Object.keys(update) },
      )

      await this.dateLogModel.update(update, {
        where: { caseId, dateType },
        transaction: options.transaction,
      })
    } catch (error) {
      this.logger.error(
        `Error updating date log of type ${dateType} for case ${caseId} with data:`,
        { data: Object.keys(update), error },
      )

      throw error
    }
  }

  async deleteByCaseAndType(
    caseId: string,
    dateType: DateType,
    options: { transaction: Transaction },
  ): Promise<number> {
    try {
      this.logger.debug(
        `Deleting date log of type ${dateType} for case ${caseId}`,
      )

      return await this.dateLogModel.destroy({
        where: { caseId, dateType },
        transaction: options.transaction,
      })
    } catch (error) {
      this.logger.error(
        `Error deleting date log of type ${dateType} for case ${caseId}:`,
        { error },
      )

      throw error
    }
  }
}
