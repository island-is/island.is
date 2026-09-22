import { literal, Op, Transaction, UpdateOptions } from 'sequelize'

import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import { type Logger, LOGGER_PROVIDER } from '@island.is/logging'

import { CaseState, CaseType } from '@island.is/judicial-system/types'

import { Case } from '../models/case.model'
import { Defendant } from '../models/defendant.model'
import { UpdateDefendant } from '../types/caseRepository.types'

interface FindDefendantOptions {
  transaction?: Transaction
}

interface CreateDefendantOptions {
  transaction: Transaction
}

interface UpdateDefendantOptions {
  transaction: Transaction
}

interface DeleteDefendantOptions {
  transaction: Transaction
}

@Injectable()
export class DefendantRepositoryService {
  constructor(
    @InjectModel(Defendant) private readonly defendantModel: typeof Defendant,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  // Looks a defendant up within a bounded set of cases - the case the caller
  // is acting on and the cases split off from it - so a defendant id from some
  // unrelated case cannot be resolved. Returns null when there is no such
  // defendant; the caller owns the response to that.
  async findByIdInCases(
    defendantId: string,
    caseIds: string[],
    options?: FindDefendantOptions,
  ): Promise<Defendant | null> {
    try {
      this.logger.debug(
        `Finding defendant ${defendantId} within ${caseIds.length} cases`,
      )

      return await this.defendantModel.findOne({
        where: { id: defendantId, caseId: { [Op.in]: caseIds } },
        transaction: options?.transaction,
      })
    } catch (error) {
      this.logger.error(
        `Error finding defendant ${defendantId} within ${caseIds.length} cases:`,
        { error },
      )

      throw error
    }
  }

  // Whether the person behind a national id is a defendant in a custody case
  // that has been accepted and has not run out. What counts as active custody
  // is defendant read semantics, so the predicate lives here rather than in
  // the caller.
  async existsInActiveCustody(nationalId: string): Promise<boolean> {
    try {
      this.logger.debug('Checking for a defendant in active custody')

      const defendantInCustody = await this.defendantModel.findOne({
        include: [
          {
            model: Case,
            as: 'case',
            where: {
              state: CaseState.ACCEPTED,
              type: CaseType.CUSTODY,
              valid_to_date: { [Op.gte]: literal('current_date') },
            },
          },
        ],
        where: { nationalId },
      })

      return Boolean(defendantInCustody)
    } catch (error) {
      this.logger.error('Error checking for a defendant in active custody:', {
        error,
      })

      throw error
    }
  }

  async create(
    data: Partial<Defendant>,
    options: CreateDefendantOptions,
  ): Promise<Defendant> {
    try {
      this.logger.debug('Creating a new defendant with data:', {
        data: Object.keys(data),
      })

      const result = await this.defendantModel.create(data, options)

      this.logger.debug(`Created a new defendant ${result.id}`)

      return result
    } catch (error) {
      this.logger.error('Error creating a new defendant with data:', {
        data: Object.keys(data),
        error,
      })

      throw error
    }
  }

  async update(
    caseId: string,
    defendantId: string,
    data: UpdateDefendant,
    options: UpdateDefendantOptions,
  ): Promise<Defendant> {
    try {
      this.logger.debug(
        `Updating defendant ${defendantId} of case ${caseId} with data:`,
        {
          data: Object.keys(data),
        },
      )

      const updateOptions: UpdateOptions = {
        where: { id: defendantId, caseId },
        transaction: options.transaction,
      }

      const [numberOfAffectedRows, defendants] =
        await this.defendantModel.update(data, {
          ...updateOptions,
          returning: true,
        })

      if (numberOfAffectedRows < 1) {
        throw new InternalServerErrorException(
          `Could not update defendant ${defendantId} of case ${caseId}`,
        )
      }

      if (numberOfAffectedRows > 1) {
        // Tolerate failure, but log error
        this.logger.error(
          `Unexpected number of rows (${numberOfAffectedRows}) affected when updating defendant ${defendantId} of case ${caseId} with data:`,
          { data: Object.keys(data) },
        )
      }

      this.logger.debug(`Updated defendant ${defendantId} of case ${caseId}`)

      return defendants[0]
    } catch (error) {
      this.logger.error(
        `Error updating defendant ${defendantId} of case ${caseId} with data:`,
        {
          data: Object.keys(data),
          error,
        },
      )

      throw error
    }
  }

  async delete(
    caseId: string,
    defendantId: string,
    options: DeleteDefendantOptions,
  ): Promise<void> {
    try {
      this.logger.debug(`Deleting defendant ${defendantId} of case ${caseId}`)

      const numberOfAffectedRows = await this.defendantModel.destroy({
        where: { id: defendantId, caseId },
        transaction: options.transaction,
      })

      if (numberOfAffectedRows < 1) {
        throw new InternalServerErrorException(
          `Could not delete defendant ${defendantId} of case ${caseId}`,
        )
      }

      if (numberOfAffectedRows > 1) {
        // Tolerate failure, but log error
        this.logger.error(
          `Unexpected number of rows (${numberOfAffectedRows}) affected when deleting defendant ${defendantId} of case ${caseId}`,
        )
      }

      this.logger.debug(`Deleted defendant ${defendantId} of case ${caseId}`)
    } catch (error) {
      this.logger.error(
        `Error deleting defendant ${defendantId} of case ${caseId}:`,
        { error },
      )

      throw error
    }
  }

  // Copies the defendants of a case to another case, keeping only the fields
  // the prosecution enters - none of the court or process data. Returns a map
  // from each original defendant id to its copy so the caller can remap the
  // references that point at defendants.
  async copyProsecutorEnteredToCase(
    caseId: string,
    newCaseId: string,
    options: { transaction: Transaction },
  ): Promise<Map<string, string>> {
    try {
      this.logger.debug(
        `Copying the prosecutor entered defendant data of case ${caseId} to case ${newCaseId}`,
      )

      const defendants = await this.defendantModel.findAll({
        where: { caseId },
        transaction: options.transaction,
      })

      const defendantIdMap = new Map<string, string>()

      for (const defendant of defendants) {
        const newDefendant = await this.defendantModel.create(
          {
            caseId: newCaseId,
            noNationalId: defendant.noNationalId,
            nationalId: defendant.nationalId,
            dateOfBirth: defendant.dateOfBirth,
            name: defendant.name,
            gender: defendant.gender,
            address: defendant.address,
            citizenship: defendant.citizenship,
            defendantPlea: defendant.defendantPlea,
          },
          { transaction: options.transaction },
        )

        defendantIdMap.set(defendant.id, newDefendant.id)
      }

      this.logger.debug(
        `Copied ${defendantIdMap.size} defendants of case ${caseId} to case ${newCaseId}`,
      )

      return defendantIdMap
    } catch (error) {
      this.logger.error(
        `Error copying the defendants of case ${caseId} to case ${newCaseId}:`,
        { error },
      )

      throw error
    }
  }

  // Moves one defendant to another case, when they are split off into a case
  // of their own. The row is addressed within its own case, so a defendant of
  // some other case cannot be moved by mistake. The route's guards bound the
  // defendant to the case before the transaction opened, so a concurrent split
  // or delete can still leave nothing to move - that fails the split rather
  // than committing a new case without its defendant.
  async moveToCase(
    defendantId: string,
    caseId: string,
    newCaseId: string,
    options: { transaction: Transaction },
  ): Promise<void> {
    try {
      this.logger.debug(
        `Moving defendant ${defendantId} from case ${caseId} to case ${newCaseId}`,
      )

      const [numberOfAffectedRows] = await this.defendantModel.update(
        { caseId: newCaseId },
        {
          where: { id: defendantId, caseId },
          transaction: options.transaction,
        },
      )

      if (numberOfAffectedRows < 1) {
        throw new InternalServerErrorException(
          `Could not move defendant ${defendantId} from case ${caseId} to case ${newCaseId}`,
        )
      }

      if (numberOfAffectedRows > 1) {
        // Tolerate failure, but log error
        this.logger.error(
          `Unexpected number of rows (${numberOfAffectedRows}) affected when moving defendant ${defendantId} from case ${caseId} to case ${newCaseId}`,
        )
      }
    } catch (error) {
      this.logger.error(
        `Error moving defendant ${defendantId} from case ${caseId} to case ${newCaseId}:`,
        { error },
      )

      throw error
    }
  }
}
