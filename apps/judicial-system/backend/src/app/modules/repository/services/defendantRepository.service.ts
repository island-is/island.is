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
  DefendantPlea,
  DefenderChoice,
  Gender,
  PunishmentType,
  SubpoenaType,
} from '@island.is/judicial-system/types'

import { Defendant } from '../models/defendant.model'

interface FindOneOptions {
  where?: FindOptions['where']
  transaction?: Transaction
  include?: FindOptions['include']
  attributes?: FindOptions['attributes']
  order?: FindOptions['order']
}

interface FindAllOptions {
  where?: FindOptions['where']
  transaction?: Transaction
  include?: FindOptions['include']
  attributes?: FindOptions['attributes']
  order?: FindOptions['order']
  limit?: FindOptions['limit']
  offset?: FindOptions['offset']
}

interface CreateDefendantOptions {
  transaction?: Transaction
}

interface UpdateDefendantOptions {
  transaction?: Transaction
}

interface DeleteDefendantOptions {
  transaction?: Transaction
}

interface UpdateDefendant {
  caseId?: string
  noNationalId?: boolean
  nationalId?: string
  dateOfBirth?: string
  name?: string
  gender?: Gender
  address?: string
  citizenship?: string
  defenderName?: string
  defenderNationalId?: string
  defenderEmail?: string
  defenderPhoneNumber?: string
  defenderChoice?: DefenderChoice
  defendantPlea?: DefendantPlea
  subpoenaType?: SubpoenaType
  requestedDefenderChoice?: DefenderChoice
  requestedDefenderNationalId?: string
  requestedDefenderName?: string
  isDefenderChoiceConfirmed?: boolean
  caseFilesSharedWithDefender?: boolean
  isSentToPrisonAdmin?: boolean
  punishmentType?: PunishmentType
  isAlternativeService?: boolean
  alternativeServiceDescription?: string
}

@Injectable()
export class DefendantRepositoryService {
  constructor(
    @InjectModel(Defendant) private readonly defendantModel: typeof Defendant,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  async findOne(options?: FindOneOptions): Promise<Defendant | null> {
    try {
      this.logger.debug('Finding defendant with conditions:', {
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

      const result = await this.defendantModel.findOne(findOptions)

      this.logger.debug(`Defendant ${result ? 'found' : 'not found'}`)

      return result
    } catch (error) {
      this.logger.error('Error finding defendant with conditions:', {
        where: Object.keys(options?.where ?? {}),
        error,
      })

      throw error
    }
  }

  async findAll(options?: FindAllOptions): Promise<Defendant[]> {
    try {
      this.logger.debug('Finding all defendants with conditions:', {
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

      if (options?.limit) {
        findOptions.limit = options.limit
      }

      if (options?.offset) {
        findOptions.offset = options.offset
      }

      const results = await this.defendantModel.findAll(findOptions)

      this.logger.debug(`Found ${results.length} defendants`)

      return results
    } catch (error) {
      this.logger.error('Error finding all defendants with conditions:', {
        where: Object.keys(options?.where ?? {}),
        error,
      })

      throw error
    }
  }

  async create(
    data: Partial<Defendant>,
    options?: CreateDefendantOptions,
  ): Promise<Defendant> {
    try {
      this.logger.debug('Creating a new defendant with data:', {
        data: Object.keys(data),
      })

      const createOptions: CreateOptions = {}

      if (options?.transaction) {
        createOptions.transaction = options.transaction
      }

      const result = await this.defendantModel.create(data, createOptions)

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
    options?: UpdateDefendantOptions,
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
      }

      if (options?.transaction) {
        updateOptions.transaction = options.transaction
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
    options?: DeleteDefendantOptions,
  ): Promise<void> {
    try {
      this.logger.debug(`Deleting defendant ${defendantId} of case ${caseId}`)

      const numberOfAffectedRows = await this.defendantModel.destroy({
        where: { id: defendantId, caseId },
        transaction: options?.transaction,
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
}
