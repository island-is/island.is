import { Transaction } from 'sequelize'

import { Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import { type Logger, LOGGER_PROVIDER } from '@island.is/logging'

import {
  IndictmentCountOffense,
  type SubstanceMap,
} from '@island.is/judicial-system/types'

import { Offense } from '../models/offense.model'

// The only updatable column; nullable in the table.
export type UpdateOffense = {
  substances?: SubstanceMap | null
}

// Sequelize returns [affectedRows, rows] from update; naming the two halves keeps
// the tuple from leaking to callers.
export type UpdatedOffenses = {
  numberOfAffectedRows: number
  offenses: Offense[]
}

// Offenses exist only under an indictment count, so every method addresses them
// through the count. The single-offense endpoints run untransacted today, so
// only the cascade method - whose callers all hold one - takes a transaction.
@Injectable()
export class OffenseRepositoryService {
  constructor(
    @InjectModel(Offense) private readonly offenseModel: typeof Offense,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  async create(
    indictmentCountId: string,
    offense: IndictmentCountOffense,
  ): Promise<Offense> {
    try {
      this.logger.debug(
        `Creating an offense for indictment count ${indictmentCountId}`,
      )

      return await this.offenseModel.create({ indictmentCountId, offense })
    } catch (error) {
      this.logger.error(
        `Error creating an offense for indictment count ${indictmentCountId}:`,
        { error },
      )

      throw error
    }
  }

  async updateByIdAndIndictmentCount(
    offenseId: string,
    indictmentCountId: string,
    update: UpdateOffense,
  ): Promise<UpdatedOffenses> {
    try {
      this.logger.debug(
        `Updating offense ${offenseId} of indictment count ${indictmentCountId} with data:`,
        { data: Object.keys(update) },
      )

      const [numberOfAffectedRows, offenses] = await this.offenseModel.update(
        update,
        { where: { id: offenseId, indictmentCountId }, returning: true },
      )

      return { numberOfAffectedRows, offenses }
    } catch (error) {
      this.logger.error(
        `Error updating offense ${offenseId} of indictment count ${indictmentCountId} with data:`,
        { data: Object.keys(update), error },
      )

      throw error
    }
  }

  async deleteByIdAndIndictmentCount(
    offenseId: string,
    indictmentCountId: string,
  ): Promise<number> {
    try {
      this.logger.debug(
        `Deleting offense ${offenseId} of indictment count ${indictmentCountId}`,
      )

      return await this.offenseModel.destroy({
        where: { id: offenseId, indictmentCountId },
      })
    } catch (error) {
      this.logger.error(
        `Error deleting offense ${offenseId} of indictment count ${indictmentCountId}:`,
        { error },
      )

      throw error
    }
  }

  async deleteAllForIndictmentCount(
    indictmentCountId: string,
    options: { transaction: Transaction },
  ): Promise<number> {
    try {
      this.logger.debug(
        `Deleting all offenses of indictment count ${indictmentCountId}`,
      )

      return await this.offenseModel.destroy({
        where: { indictmentCountId },
        transaction: options.transaction,
      })
    } catch (error) {
      this.logger.error(
        `Error deleting all offenses of indictment count ${indictmentCountId}:`,
        { error },
      )

      throw error
    }
  }
}
