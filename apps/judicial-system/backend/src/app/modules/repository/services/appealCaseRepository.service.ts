import { Transaction } from 'sequelize'

import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import { type Logger, LOGGER_PROVIDER } from '@island.is/logging'

import { AppealCaseType } from '@island.is/judicial-system/types'

import { AppealCase } from '../models/appealCase.model'
import {
  CreateAppealCase,
  UpdateAppealCase,
} from '../types/caseRepository.types'

interface AppealCaseTransactionOptions {
  transaction?: Transaction
}

interface CreateAppealCaseOptions {
  transaction: Transaction
}

interface UpdateAppealCaseOptions {
  transaction: Transaction
}

interface DeleteAppealCaseOptions {
  transaction: Transaction
}

@Injectable()
export class AppealCaseRepositoryService {
  constructor(
    @InjectModel(AppealCase)
    private readonly appealCaseModel: typeof AppealCase,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  async findById(
    id: string,
    options?: AppealCaseTransactionOptions,
  ): Promise<AppealCase | null> {
    try {
      this.logger.debug(`Finding appeal case ${id}`)

      const result = await this.appealCaseModel.findOne({
        where: { id },
        transaction: options?.transaction,
      })

      this.logger.debug(`Appeal case ${id} ${result ? 'found' : 'not found'}`)

      return result
    } catch (error) {
      this.logger.error(`Error finding appeal case ${id}:`, { error })

      throw error
    }
  }

  // A case has at most one verdict appeal - every defendant who appeals joins
  // it - and the unique index on (case_id, ruling_file_id), NULLS NOT DISTINCT,
  // holds that, since a verdict appeal has no ruling file.
  async findVerdictAppealByCaseId(
    caseId: string,
    options?: AppealCaseTransactionOptions,
  ): Promise<AppealCase | null> {
    try {
      this.logger.debug(`Finding the verdict appeal of case ${caseId}`)

      const result = await this.appealCaseModel.findOne({
        where: { caseId, appealType: AppealCaseType.VERDICT },
        transaction: options?.transaction,
      })

      this.logger.debug(
        `Verdict appeal of case ${caseId} ${result ? 'found' : 'not found'}`,
      )

      return result
    } catch (error) {
      this.logger.error(`Error finding the verdict appeal of case ${caseId}:`, {
        error,
      })

      throw error
    }
  }

  // Whether any appeal case of the case keys on the given ruling file, in any
  // appeal state, read from the caller's transaction.
  async existsForRulingFile(
    caseId: string,
    rulingFileId: string,
    options?: AppealCaseTransactionOptions,
  ): Promise<boolean> {
    try {
      this.logger.debug(
        `Checking for an appeal of ruling ${rulingFileId} of case ${caseId}`,
      )

      const result = await this.appealCaseModel.findOne({
        where: { caseId, rulingFileId },
        transaction: options?.transaction,
      })

      return Boolean(result)
    } catch (error) {
      this.logger.error(
        `Error checking for an appeal of ruling ${rulingFileId} of case ${caseId}:`,
        { error },
      )

      throw error
    }
  }

  async create(
    caseId: string,
    data: CreateAppealCase,
    options: CreateAppealCaseOptions,
  ): Promise<AppealCase> {
    try {
      this.logger.debug(`Creating appeal case for case ${caseId} with data:`, {
        data: Object.keys(data),
      })

      const result = await this.appealCaseModel.create(
        { ...data, caseId },
        { transaction: options.transaction },
      )

      this.logger.debug(`Created appeal case ${result.id} for case ${caseId}`)

      return result
    } catch (error) {
      this.logger.error(
        `Error creating appeal case for case ${caseId} with data:`,
        { data: Object.keys(data), error },
      )

      throw error
    }
  }

  async update(
    appealCaseId: string,
    data: UpdateAppealCase,
    options: UpdateAppealCaseOptions,
  ): Promise<AppealCase> {
    try {
      this.logger.debug(`Updating appeal case ${appealCaseId} with data:`, {
        data: Object.keys(data),
      })

      const [numberOfAffectedRows, updatedAppealCases] =
        await this.appealCaseModel.update(data, {
          where: { id: appealCaseId },
          transaction: options.transaction,
          returning: true,
        })

      if (numberOfAffectedRows < 1) {
        throw new InternalServerErrorException(
          `Could not update appeal case ${appealCaseId}`,
        )
      }

      if (numberOfAffectedRows > 1) {
        this.logger.error(
          `Unexpected number of rows (${numberOfAffectedRows}) affected when updating appeal case ${appealCaseId}`,
        )
      }

      this.logger.debug(`Updated appeal case ${appealCaseId}`)

      return updatedAppealCases[0]
    } catch (error) {
      this.logger.error(
        `Error updating appeal case ${appealCaseId} with data:`,
        { data: Object.keys(data), error },
      )

      throw error
    }
  }

  async delete(
    appealCaseId: string,
    options: DeleteAppealCaseOptions,
  ): Promise<void> {
    try {
      this.logger.debug(`Deleting appeal case ${appealCaseId}`)

      const numberOfAffectedRows = await this.appealCaseModel.destroy({
        where: { id: appealCaseId },
        transaction: options.transaction,
      })

      if (numberOfAffectedRows < 1) {
        throw new InternalServerErrorException(
          `Could not delete appeal case ${appealCaseId}`,
        )
      }

      this.logger.debug(`Deleted appeal case ${appealCaseId}`)
    } catch (error) {
      this.logger.error(`Error deleting appeal case ${appealCaseId}:`, {
        error,
      })

      throw error
    }
  }
}
