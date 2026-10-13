import { Transaction } from 'sequelize'

import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import { type Logger, LOGGER_PROVIDER } from '@island.is/logging'

import {
  AppealSummonsAppellantSide,
  HashAlgorithm,
} from '@island.is/judicial-system/types'

import { AppealSummons } from '../models/appealSummons.model'
import { AppealSummonsDefendant } from '../models/appealSummonsDefendant.model'

export type CreateAppealSummons = {
  caseId: string
  appealCaseId: string
}

export type CreateAppealSummonsDefendant = {
  appealSummonsId: string
  defendantId: string
  appellantSide: AppealSummonsAppellantSide
  claims: string
}

export type UpdateAppealSummons = {
  confirmedById?: string | null
  confirmedDate?: Date | null
  hash?: string | null
  hashAlgorithm?: HashAlgorithm | null
}

@Injectable()
export class AppealSummonsRepositoryService {
  constructor(
    @InjectModel(AppealSummons)
    private readonly appealSummonsModel: typeof AppealSummons,
    @InjectModel(AppealSummonsDefendant)
    private readonly appealSummonsDefendantModel: typeof AppealSummonsDefendant,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  async create(
    data: CreateAppealSummons,
    options: { transaction: Transaction },
  ): Promise<AppealSummons> {
    try {
      this.logger.debug(
        `Creating an appeal summons for case ${data.caseId} and appeal case ${data.appealCaseId}`,
      )

      const result = await this.appealSummonsModel.create(data, {
        transaction: options.transaction,
      })

      this.logger.debug(`Created appeal summons ${result.id}`)

      return result
    } catch (error) {
      this.logger.error(
        `Error creating an appeal summons for case ${data.caseId}:`,
        { error },
      )

      throw error
    }
  }

  async findByIdAndCaseId(
    id: string,
    caseId: string,
    options?: { transaction?: Transaction },
  ): Promise<AppealSummons | null> {
    try {
      this.logger.debug(`Finding appeal summons ${id} for case ${caseId}`)

      const result = await this.appealSummonsModel.findOne({
        where: { id, caseId },
        include: [
          {
            model: AppealSummonsDefendant,
            as: 'defendants',
            required: false,
            separate: true,
            order: [['created', 'ASC']],
          },
        ],
        transaction: options?.transaction,
      })

      this.logger.debug(
        result
          ? `Found appeal summons ${id}`
          : `Appeal summons ${id} not found for case ${caseId}`,
      )

      return result
    } catch (error) {
      this.logger.error(
        `Error finding appeal summons ${id} for case ${caseId}:`,
        { error },
      )

      throw error
    }
  }

  async createDefendant(
    data: CreateAppealSummonsDefendant,
    options: { transaction: Transaction },
  ): Promise<AppealSummonsDefendant> {
    try {
      this.logger.debug(
        `Creating an appeal summons defendant row for summons ${data.appealSummonsId}`,
      )

      const result = await this.appealSummonsDefendantModel.create(data, {
        transaction: options.transaction,
      })

      this.logger.debug(
        `Created appeal summons defendant row ${result.id} for summons ${data.appealSummonsId}`,
      )

      return result
    } catch (error) {
      this.logger.error(
        `Error creating an appeal summons defendant row for summons ${data.appealSummonsId}:`,
        { error },
      )

      throw error
    }
  }

  async update(
    id: string,
    caseId: string,
    data: UpdateAppealSummons,
    options: { transaction: Transaction },
  ): Promise<AppealSummons> {
    try {
      this.logger.debug(`Updating appeal summons ${id} of case ${caseId}`)

      const [numberOfAffectedRows] = await this.appealSummonsModel.update(
        data,
        {
          where: { id, caseId },
          transaction: options.transaction,
        },
      )

      if (numberOfAffectedRows < 1) {
        throw new InternalServerErrorException(
          `Could not update appeal summons ${id} of case ${caseId}`,
        )
      }

      const updated = await this.findByIdAndCaseId(id, caseId, options)

      if (!updated) {
        throw new InternalServerErrorException(
          `Appeal summons ${id} of case ${caseId} was not found after update`,
        )
      }

      this.logger.debug(`Updated appeal summons ${id}`)

      return updated
    } catch (error) {
      this.logger.error(
        `Error updating appeal summons ${id} of case ${caseId}:`,
        { error },
      )

      throw error
    }
  }

  async deleteDefendants(
    appealSummonsId: string,
    options: { transaction: Transaction },
  ): Promise<number> {
    try {
      this.logger.debug(
        `Deleting appeal summons defendant rows for summons ${appealSummonsId}`,
      )

      const numberOfDeletedRows =
        await this.appealSummonsDefendantModel.destroy({
          where: { appealSummonsId },
          transaction: options.transaction,
        })

      this.logger.debug(
        `Deleted ${numberOfDeletedRows} appeal summons defendant row(s) for summons ${appealSummonsId}`,
      )

      return numberOfDeletedRows
    } catch (error) {
      this.logger.error(
        `Error deleting appeal summons defendant rows for summons ${appealSummonsId}:`,
        { error },
      )

      throw error
    }
  }

  async delete(
    id: string,
    caseId: string,
    options: { transaction: Transaction },
  ): Promise<boolean> {
    try {
      this.logger.debug(`Deleting appeal summons ${id} of case ${caseId}`)

      await this.deleteDefendants(id, options)

      const numberOfDeletedRows = await this.appealSummonsModel.destroy({
        where: { id, caseId },
        transaction: options.transaction,
      })

      if (numberOfDeletedRows < 1) {
        throw new InternalServerErrorException(
          `Could not delete appeal summons ${id} of case ${caseId}`,
        )
      }

      this.logger.debug(`Deleted appeal summons ${id}`)

      return true
    } catch (error) {
      this.logger.error(
        `Error deleting appeal summons ${id} of case ${caseId}:`,
        { error },
      )

      throw error
    }
  }
}
