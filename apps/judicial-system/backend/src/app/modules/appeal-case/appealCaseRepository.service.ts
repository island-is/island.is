import { FindOptions, Transaction } from 'sequelize'

import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import { type Logger, LOGGER_PROVIDER } from '@island.is/logging'

import { AppealCase, UpdateAppealCase } from '../repository'

interface FindByIdOptions {
  transaction?: Transaction
  include?: FindOptions['include']
}

interface CreateAppealCaseOptions {
  transaction: Transaction
}

interface UpdateAppealCaseOptions {
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
    options?: FindByIdOptions,
  ): Promise<AppealCase | null> {
    try {
      this.logger.debug(`Finding appeal case ${id}`)

      const findOptions: FindOptions = { where: { id } }

      if (options?.transaction) {
        findOptions.transaction = options.transaction
      }

      if (options?.include) {
        findOptions.include = options.include
      }

      const result = await this.appealCaseModel.findOne(findOptions)

      this.logger.debug(`Appeal case ${id} ${result ? 'found' : 'not found'}`)

      return result
    } catch (error) {
      this.logger.error(`Error finding appeal case ${id}:`, { error })

      throw error
    }
  }

  async create(
    caseId: string,
    data: UpdateAppealCase,
    options: CreateAppealCaseOptions,
  ): Promise<AppealCase> {
    try {
      this.logger.debug(
        `Creating appeal case for case ${caseId} with data:`,
        { data: Object.keys(data) },
      )

      const result = await this.appealCaseModel.create(
        { ...data, caseId },
        { transaction: options.transaction },
      )

      this.logger.debug(
        `Created appeal case ${result.id} for case ${caseId}`,
      )

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
      this.logger.debug(
        `Updating appeal case ${appealCaseId} with data:`,
        { data: Object.keys(data) },
      )

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
}
