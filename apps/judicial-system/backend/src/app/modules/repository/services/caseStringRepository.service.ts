import { Transaction } from 'sequelize'

import { Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import { type Logger, LOGGER_PROVIDER } from '@island.is/logging'

import { StringType } from '@island.is/judicial-system/types'

import { CaseString } from '../models/caseString.model'

// A case string is addressed by (caseId, stringType) - the table has a
// composite UNIQUE on the pair - so both key columns are named parameters
// rather than a caller-supplied where clause, and the upsert can resolve its
// conflict on exactly those two columns.
//
// The only value column is optional because the one update caller (the archive
// path) builds its payload generically from a property list.
export type UpdateCaseString = {
  value?: string
}

@Injectable()
export class CaseStringRepositoryService {
  constructor(
    @InjectModel(CaseString)
    private readonly caseStringModel: typeof CaseString,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  // Inserts the case string, or replaces its value when one of this type
  // already exists for the case, in a single statement.
  async upsertByCaseAndType(
    caseId: string,
    stringType: StringType,
    value: string,
    options: { transaction: Transaction },
  ): Promise<CaseString> {
    try {
      this.logger.debug(
        `Upserting case string of type ${stringType} for case ${caseId}`,
      )

      const [caseString] = await this.caseStringModel.upsert(
        { caseId, stringType, value },
        {
          conflictFields: ['case_id', 'string_type'],
          transaction: options.transaction,
        },
      )

      return caseString
    } catch (error) {
      this.logger.error(
        `Error upserting case string of type ${stringType} for case ${caseId}:`,
        { error },
      )

      throw error
    }
  }

  async deleteByCaseAndType(
    caseId: string,
    stringType: StringType,
    options: { transaction: Transaction },
  ): Promise<number> {
    try {
      this.logger.debug(
        `Deleting case string of type ${stringType} for case ${caseId}`,
      )

      return await this.caseStringModel.destroy({
        where: { caseId, stringType },
        transaction: options.transaction,
      })
    } catch (error) {
      this.logger.error(
        `Error deleting case string of type ${stringType} for case ${caseId}:`,
        { error },
      )

      throw error
    }
  }

  // The row count is not reported: the only caller iterates rows it has just
  // loaded and ignores the result. Add one when a caller needs it.
  async updateByIdAndCase(
    caseStringId: string,
    caseId: string,
    update: UpdateCaseString,
    options: { transaction: Transaction },
  ): Promise<void> {
    try {
      this.logger.debug(
        `Updating case string ${caseStringId} of case ${caseId} with data:`,
        { data: Object.keys(update) },
      )

      await this.caseStringModel.update(update, {
        where: { id: caseStringId, caseId },
        transaction: options.transaction,
      })
    } catch (error) {
      this.logger.error(
        `Error updating case string ${caseStringId} of case ${caseId} with data:`,
        { data: Object.keys(update), error },
      )

      throw error
    }
  }

  // Copies the case strings of the given types to another case as new rows.
  // Which types travel is the caller's decision; how they are copied is not.
  async copyByTypesToCase(
    caseId: string,
    newCaseId: string,
    stringTypes: StringType[],
    options: { transaction: Transaction },
  ): Promise<void> {
    try {
      this.logger.debug(
        `Copying the case strings of types ${stringTypes.join(
          ', ',
        )} of case ${caseId} to case ${newCaseId}`,
      )

      const caseStrings = await this.caseStringModel.findAll({
        where: { caseId, stringType: stringTypes },
        transaction: options.transaction,
      })

      await Promise.all(
        caseStrings.map((caseString) =>
          this.caseStringModel.create(
            { ...caseString.toJSON(), id: undefined, caseId: newCaseId },
            { transaction: options.transaction },
          ),
        ),
      )

      this.logger.debug(
        `Copied ${caseStrings.length} case strings of case ${caseId} to case ${newCaseId}`,
      )
    } catch (error) {
      this.logger.error(
        `Error copying the case strings of types ${stringTypes.join(
          ', ',
        )} of case ${caseId} to case ${newCaseId}:`,
        { error },
      )

      throw error
    }
  }
}
