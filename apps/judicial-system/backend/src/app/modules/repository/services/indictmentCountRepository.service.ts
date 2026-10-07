import { Transaction } from 'sequelize'

import { Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import { type Logger, LOGGER_PROVIDER } from '@island.is/logging'

import { IndictmentSubtype } from '@island.is/judicial-system/types'

import { IndictmentCount } from '../models/indictmentCount.model'
import { Offense } from '../models/offense.model'

// The display order is computed by the caller from the case's current maximum;
// the police case number is set only when a count is created for one of the
// case's police case numbers.
export type CreateIndictmentCount = {
  displayOrder: number
  policeCaseNumber?: string
}

// Typed by the columns, not by the DTO that usually feeds it: every column but
// displayOrder is nullable, and both the traffic-violation cascade and the
// archive path clear columns with null. Keys that are not columns (the DTO's
// policeCaseNumberSubtypes) are dropped by Sequelize before the UPDATE.
export type UpdateIndictmentCount = {
  displayOrder?: number
  policeCaseNumber?: string | null
  vehicleRegistrationNumber?: string | null
  lawsBroken?: [number, number][] | null
  incidentDescription?: string | null
  legalArguments?: string | null
  indictmentCountSubtypes?: IndictmentSubtype[] | null
  recordedSpeed?: number | null
  speedLimit?: number | null
}

// Sequelize returns [affectedRows, rows] from update; naming the two halves keeps
// the tuple from leaking to callers.
export type UpdatedIndictmentCounts = {
  numberOfAffectedRows: number
  indictmentCounts: IndictmentCount[]
}

@Injectable()
export class IndictmentCountRepositoryService {
  constructor(
    @InjectModel(IndictmentCount)
    private readonly indictmentCountModel: typeof IndictmentCount,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  // The offenses ride along in creation order, loaded as a separate query so
  // the count itself stays a single row.
  async findByIdWithOffenses(
    indictmentCountId: string,
  ): Promise<IndictmentCount | null> {
    try {
      this.logger.debug(
        `Finding indictment count ${indictmentCountId} with its offenses`,
      )

      const result = await this.indictmentCountModel.findByPk(
        indictmentCountId,
        {
          include: [
            {
              model: Offense,
              as: 'offenses',
              required: false,
              separate: true,
              order: [['created', 'ASC']],
            },
          ],
        },
      )

      this.logger.debug(
        `Indictment count ${indictmentCountId} ${
          result ? 'found' : 'not found'
        }`,
      )

      return result
    } catch (error) {
      this.logger.error(
        `Error finding indictment count ${indictmentCountId} with its offenses:`,
        { error },
      )

      throw error
    }
  }

  // Null when the case has no indictment counts yet; the caller picks the
  // fallback.
  async getMaxDisplayOrderForCase(
    caseId: string,
    options: { transaction: Transaction },
  ): Promise<number | null> {
    try {
      this.logger.debug(
        `Finding the highest indictment count display order of case ${caseId}`,
      )

      const maxDisplayOrder = await this.indictmentCountModel.max(
        'displayOrder',
        { where: { caseId }, transaction: options.transaction },
      )

      return typeof maxDisplayOrder === 'number' ? maxDisplayOrder : null
    } catch (error) {
      this.logger.error(
        `Error finding the highest indictment count display order of case ${caseId}:`,
        { error },
      )

      throw error
    }
  }

  // Display order first, creation time as the tie-breaker.
  async findAllForCaseOrdered(
    caseId: string,
    options: { transaction: Transaction },
  ): Promise<IndictmentCount[]> {
    try {
      this.logger.debug(`Finding all indictment counts of case ${caseId}`)

      return await this.indictmentCountModel.findAll({
        where: { caseId },
        order: [
          ['displayOrder', 'ASC'],
          ['created', 'ASC'],
        ],
        transaction: options.transaction,
      })
    } catch (error) {
      this.logger.error(
        `Error finding all indictment counts of case ${caseId}:`,
        { error },
      )

      throw error
    }
  }

  async create(
    caseId: string,
    indictmentCount: CreateIndictmentCount,
    options: { transaction: Transaction },
  ): Promise<IndictmentCount> {
    try {
      this.logger.debug(`Creating an indictment count for case ${caseId}`)

      return await this.indictmentCountModel.create(
        { caseId, ...indictmentCount },
        { transaction: options.transaction },
      )
    } catch (error) {
      this.logger.error(
        `Error creating an indictment count for case ${caseId}:`,
        { error },
      )

      throw error
    }
  }

  // An indictment count is only addressable within its own case, so both keys
  // are named parameters rather than a caller-supplied where clause.
  async updateByIdAndCase(
    indictmentCountId: string,
    caseId: string,
    update: UpdateIndictmentCount,
    options: { transaction: Transaction },
  ): Promise<UpdatedIndictmentCounts> {
    try {
      this.logger.debug(
        `Updating indictment count ${indictmentCountId} of case ${caseId} with data:`,
        { data: Object.keys(update) },
      )

      const [numberOfAffectedRows, indictmentCounts] =
        await this.indictmentCountModel.update(update, {
          where: { id: indictmentCountId, caseId },
          returning: true,
          transaction: options.transaction,
        })

      return { numberOfAffectedRows, indictmentCounts }
    } catch (error) {
      this.logger.error(
        `Error updating indictment count ${indictmentCountId} of case ${caseId} with data:`,
        { data: Object.keys(update), error },
      )

      throw error
    }
  }

  async deleteByIdAndCase(
    indictmentCountId: string,
    caseId: string,
    options: { transaction: Transaction },
  ): Promise<number> {
    try {
      this.logger.debug(
        `Deleting indictment count ${indictmentCountId} of case ${caseId}`,
      )

      return await this.indictmentCountModel.destroy({
        where: { id: indictmentCountId, caseId },
        transaction: options.transaction,
      })
    } catch (error) {
      this.logger.error(
        `Error deleting indictment count ${indictmentCountId} of case ${caseId}:`,
        { error },
      )

      throw error
    }
  }

  // Copies every indictment count of a case to another case as a new row.
  // Returns a map from each original count id to its copy so the caller can
  // copy the offenses, which hang off the counts, against the new ids.
  async copyAllToCase(
    caseId: string,
    newCaseId: string,
    options: { transaction: Transaction },
  ): Promise<Map<string, string>> {
    try {
      this.logger.debug(
        `Copying all indictment counts of case ${caseId} to case ${newCaseId}`,
      )

      const indictmentCounts = await this.indictmentCountModel.findAll({
        where: { caseId },
        transaction: options.transaction,
      })

      const indictmentCountIdMap = new Map<string, string>()

      for (const indictmentCount of indictmentCounts) {
        const newIndictmentCount = await this.indictmentCountModel.create(
          { ...indictmentCount.toJSON(), id: undefined, caseId: newCaseId },
          { transaction: options.transaction },
        )

        indictmentCountIdMap.set(indictmentCount.id, newIndictmentCount.id)
      }

      this.logger.debug(
        `Copied ${indictmentCountIdMap.size} indictment counts of case ${caseId} to case ${newCaseId}`,
      )

      return indictmentCountIdMap
    } catch (error) {
      this.logger.error(
        `Error copying all indictment counts of case ${caseId} to case ${newCaseId}:`,
        { error },
      )

      throw error
    }
  }
}
