import {
  CreateOptions,
  FindOptions,
  Transaction,
  UpdateOptions,
} from 'sequelize'

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

interface FindOneOptions {
  where?: FindOptions['where']
  transaction?: Transaction
  include?: FindOptions['include']
  attributes?: FindOptions['attributes']
  order?: FindOptions['order']
}

interface CreateVerdictOptions {
  transaction?: Transaction
}

interface UpdateVerdictOptions {
  transaction?: Transaction
}

interface DeleteVerdictOptions {
  transaction?: Transaction
}

interface UpdateVerdict {
  externalPoliceDocumentId?: string
  serviceStatus?: VerdictServiceStatus
  serviceRequirement?: ServiceRequirement
  servedBy?: string
  deliveredToDefenderNationalId?: string
  appealDecision?: string
  appealDate?: Date
  serviceInformationForDefendant?: InformationForDefendant[]
  isDefaultJudgement?: boolean
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

  async findOne(options?: FindOneOptions): Promise<Verdict | null> {
    try {
      this.logger.debug('Finding verdict with conditions:', {
        where: Object.keys(options?.where ?? {}),
      })

      const findOptions: FindOptions = {}

      if (options?.where) {
        findOptions.where = options.where
      }

      if (options?.transaction) {
        findOptions.transaction = options.transaction
      }

      if (options?.include) {
        findOptions.include = options.include
      }

      if (options?.attributes) {
        findOptions.attributes = options.attributes
      }

      if (options?.order) {
        findOptions.order = options.order
      }

      const result = await this.verdictModel.findOne(findOptions)

      this.logger.debug(`Verdict ${result ? 'found' : 'not found'}`)

      return result
    } catch (error) {
      this.logger.error('Error finding verdict with conditions:', {
        where: Object.keys(options?.where ?? {}),
        error,
      })

      throw error
    }
  }

  async create(
    data: Partial<Verdict>,
    options?: CreateVerdictOptions,
  ): Promise<Verdict> {
    try {
      this.logger.debug('Creating a new verdict with data:', {
        data: Object.keys(data),
      })

      const createOptions: CreateOptions = {}

      if (options?.transaction) {
        createOptions.transaction = options.transaction
      }

      const result = await this.verdictModel.create(data, createOptions)

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
    options?: UpdateVerdictOptions,
  ): Promise<Verdict> {
    try {
      this.logger.debug(
        `Updating verdict ${verdictId} of defendant ${defendantId} and case ${caseId} with data:`,
        { data: Object.keys(data) },
      )

      const updateOptions: UpdateOptions = {
        where: { id: verdictId, caseId, defendantId },
      }

      if (options?.transaction) {
        updateOptions.transaction = options.transaction
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
    options?: DeleteVerdictOptions,
  ): Promise<void> {
    try {
      this.logger.debug(
        `Deleting verdict ${verdictId} of defendant ${defendantId} and case ${caseId}`,
      )

      const updateOptions: UpdateOptions = {
        where: { id: verdictId, defendantId, caseId },
      }

      if (options?.transaction) {
        updateOptions.transaction = options.transaction
      }

      const numberOfAffectedRows = await this.verdictModel.destroy(
        updateOptions,
      )

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
}
