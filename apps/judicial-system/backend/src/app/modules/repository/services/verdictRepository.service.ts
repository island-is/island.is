import { Transaction, UpdateOptions } from 'sequelize'

import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import { type Logger, LOGGER_PROVIDER } from '@island.is/logging'

import {
  HashAlgorithm,
  InformationForDefendant,
  VerdictServiceStatus,
} from '@island.is/judicial-system/types'
import { ServiceRequirement } from '@island.is/judicial-system/types'

import { Verdict } from '../models/verdict.model'

interface FindVerdictOptions {
  transaction?: Transaction
}

interface CreateVerdictOptions {
  transaction: Transaction
}

interface UpdateVerdictOptions {
  transaction: Transaction
}

interface DeleteVerdictOptions {
  transaction: Transaction
}

interface UpdateVerdict {
  externalPoliceDocumentId?: string
  serviceStatus?: VerdictServiceStatus
  serviceRequirement?: ServiceRequirement | null
  servedBy?: string
  deliveredToDefenderNationalId?: string
  appealDecision?: string
  appealDate?: Date | null
  serviceInformationForDefendant?: InformationForDefendant[]
  isDefaultJudgement?: boolean | null
  isAcquittedByPublicProsecutionOffice?: boolean | null
  defendantHasRequestedAppeal?: boolean | null
  hash?: string
  hashAlgorithm?: HashAlgorithm
  serviceDate?: Date | null
}

@Injectable()
export class VerdictRepositoryService {
  constructor(
    @InjectModel(Verdict) private readonly verdictModel: typeof Verdict,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  async findById(
    verdictId: string,
    options?: FindVerdictOptions,
  ): Promise<Verdict | null> {
    try {
      this.logger.debug(`Finding verdict ${verdictId}`)

      return await this.verdictModel.findOne({
        where: { id: verdictId },
        transaction: options?.transaction,
      })
    } catch (error) {
      this.logger.error(`Error finding verdict ${verdictId}:`, { error })

      throw error
    }
  }

  // externalPoliceDocumentId is the verdict's document id in the police
  // systems, handed back to us when the verdict is registered with them.
  async findByExternalPoliceDocumentId(
    externalPoliceDocumentId: string,
  ): Promise<Verdict | null> {
    try {
      this.logger.debug(
        `Finding verdict with police document id ${externalPoliceDocumentId}`,
      )

      return await this.verdictModel.findOne({
        where: { externalPoliceDocumentId },
      })
    } catch (error) {
      this.logger.error(
        `Error finding verdict with police document id ${externalPoliceDocumentId}:`,
        { error },
      )

      throw error
    }
  }

  // The defendant's most recent verdict, across every case they appear in.
  // Returns null when the defendant has no verdict yet.
  async findLatestForDefendant(
    defendantId: string,
    options?: FindVerdictOptions,
  ): Promise<Verdict | null> {
    try {
      this.logger.debug(
        `Finding the latest verdict of defendant ${defendantId}`,
      )

      return await this.verdictModel.findOne({
        where: { defendantId },
        order: [['created', 'DESC']],
        transaction: options?.transaction,
      })
    } catch (error) {
      this.logger.error(
        `Error finding the latest verdict of defendant ${defendantId}:`,
        { error },
      )

      throw error
    }
  }

  async create(
    data: Partial<Verdict>,
    options: CreateVerdictOptions,
  ): Promise<Verdict> {
    try {
      this.logger.debug('Creating a new verdict with data:', {
        data: Object.keys(data),
      })

      const result = await this.verdictModel.create(data, options)

      this.logger.debug(`Created a new verdict ${result.id}`)

      return result
    } catch (error) {
      this.logger.error('Error creating a new verdict with data:', {
        data: Object.keys(data),
        error,
      })

      throw error
    }
  }

  async update(
    caseId: string,
    defendantId: string,
    verdictId: string,
    data: UpdateVerdict,
    options: UpdateVerdictOptions,
  ): Promise<Verdict> {
    try {
      this.logger.debug(
        `Updating verdict ${verdictId} of defendant ${defendantId} and case ${caseId} with data:`,
        { data: Object.keys(data) },
      )

      const updateOptions: UpdateOptions = {
        where: { id: verdictId, caseId, defendantId },
        transaction: options.transaction,
      }

      const [numberOfAffectedRows, updatedVerdicts] =
        await this.verdictModel.update(data, {
          ...updateOptions,
          returning: true,
        })

      if (numberOfAffectedRows < 1) {
        throw new InternalServerErrorException(
          `Could not update verdict ${verdictId}`,
        )
      }

      if (numberOfAffectedRows > 1) {
        // Tolerate failure, but log error
        this.logger.error(
          `Unexpected number of rows (${numberOfAffectedRows}) affected when updating verdict ${verdictId} of defendant ${defendantId} and case ${caseId} with data:`,
          { data: Object.keys(data) },
        )
      }

      this.logger.debug(
        `Updated verdict ${verdictId} of defendant ${defendantId} and case ${caseId}`,
      )

      return updatedVerdicts[0]
    } catch (error) {
      this.logger.error(
        `Error updating verdict ${verdictId} of defendant ${defendantId} and case ${caseId} with data:`,
        { data: Object.keys(data), error },
      )

      throw error
    }
  }

  async delete(
    caseId: string,
    defendantId: string,
    verdictId: string,
    options: DeleteVerdictOptions,
  ): Promise<void> {
    try {
      this.logger.debug(
        `Deleting verdict ${verdictId} of defendant ${defendantId} and case ${caseId}`,
      )

      const numberOfAffectedRows = await this.verdictModel.destroy({
        where: { id: verdictId, defendantId, caseId },
        transaction: options.transaction,
      })

      if (numberOfAffectedRows < 1) {
        throw new InternalServerErrorException(
          `Could not delete verdict ${verdictId} of defendant ${defendantId} and case ${caseId}`,
        )
      }

      if (numberOfAffectedRows > 1) {
        // Tolerate failure, but log error
        this.logger.error(
          `Unexpected number of rows (${numberOfAffectedRows}) affected when deleting verdict ${verdictId} of defendant ${defendantId} and case ${caseId}`,
        )
      }

      this.logger.debug(
        `Deleted verdict ${verdictId} of defendant ${defendantId} and case ${caseId}`,
      )
    } catch (error) {
      this.logger.error(
        `Error deleting verdict ${verdictId} of defendant ${defendantId} and case ${caseId}:`,
        { error },
      )

      throw error
    }
  }

  // Moves every verdict of a defendant to another case, when the defendant is
  // split off into a case of their own. Returns the number of verdicts moved.
  async moveAllForDefendantToCase(
    caseId: string,
    defendantId: string,
    newCaseId: string,
    options: { transaction: Transaction },
  ): Promise<number> {
    try {
      this.logger.debug(
        `Moving the verdicts of defendant ${defendantId} from case ${caseId} to case ${newCaseId}`,
      )

      const [numberOfAffectedRows] = await this.verdictModel.update(
        { caseId: newCaseId },
        { where: { caseId, defendantId }, transaction: options.transaction },
      )

      this.logger.debug(
        `Moved ${numberOfAffectedRows} verdicts of defendant ${defendantId} from case ${caseId} to case ${newCaseId}`,
      )

      return numberOfAffectedRows
    } catch (error) {
      this.logger.error(
        `Error moving the verdicts of defendant ${defendantId} from case ${caseId} to case ${newCaseId}:`,
        { error },
      )

      throw error
    }
  }
}
