import { FindOptions, Transaction, UpdateOptions } from 'sequelize'

import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import { type Logger, LOGGER_PROVIDER } from '@island.is/logging'

import { HashAlgorithm, ServiceStatus } from '@island.is/judicial-system/types'

import { Subpoena } from '../models/subpoena.model'

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
  group?: FindOptions['group']
  raw?: boolean
}

interface CreateSubpoenaOptions {
  transaction: Transaction
}

interface UpdateSubpoenaOptions {
  transaction: Transaction
  throwOnZeroRows?: boolean
}

interface UpdateSubpoena {
  hash?: string
  hashAlgorithm?: HashAlgorithm
  serviceStatus?: ServiceStatus
  serviceDate?: Date
  servedBy?: string
  comment?: string
  defenderNationalId?: string
  policeSubpoenaId?: string
}

@Injectable()
export class SubpoenaRepositoryService {
  constructor(
    @InjectModel(Subpoena) private readonly subpoenaModel: typeof Subpoena,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  async findOne(options?: FindOneOptions): Promise<Subpoena | null> {
    try {
      this.logger.debug('Finding subpoena with conditions:', {
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

      const result = await this.subpoenaModel.findOne(findOptions)

      this.logger.debug(`Subpoena ${result ? 'found' : 'not found'}`)

      return result
    } catch (error) {
      this.logger.error('Error finding subpoena with conditions:', {
        where: Object.keys(options?.where ?? {}),
        error,
      })

      throw error
    }
  }

  async findAll(options?: FindAllOptions): Promise<Subpoena[]> {
    try {
      this.logger.debug('Finding all subpoenas with conditions:', {
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

      if (options?.group) {
        findOptions.group = options.group
      }

      if (options?.raw !== undefined) {
        findOptions.raw = options.raw
      }

      const results = await this.subpoenaModel.findAll(findOptions)

      this.logger.debug(`Found ${results.length} subpoenas`)

      return results
    } catch (error) {
      this.logger.error('Error finding all subpoenas with conditions:', {
        where: Object.keys(options?.where ?? {}),
        error,
      })

      throw error
    }
  }

  async create(
    data: Partial<Subpoena>,
    options: CreateSubpoenaOptions,
  ): Promise<Subpoena> {
    try {
      this.logger.debug('Creating a new subpoena with data:', {
        data: Object.keys(data),
      })

      const result = await this.subpoenaModel.create(data, options)

      this.logger.debug(`Created a new subpoena ${result.id}`)

      return result
    } catch (error) {
      this.logger.error('Error creating a new subpoena with data:', {
        data: Object.keys(data),
        error,
      })

      throw error
    }
  }

  async update(
    caseId: string,
    defendantId: string,
    subpoenaId: string,
    data: UpdateSubpoena,
    options: UpdateSubpoenaOptions,
  ): Promise<Subpoena> {
    const throwOnZeroRows = options?.throwOnZeroRows ?? true

    try {
      this.logger.debug(
        `Updating subpoena ${subpoenaId} of defendant ${defendantId} and case ${caseId} with data:`,
        { data: Object.keys(data) },
      )

      const updateOptions: UpdateOptions = {
        where: { id: subpoenaId, caseId, defendantId },
        transaction: options.transaction,
      }

      const [numberOfAffectedRows, updatedSubpoenas] =
        await this.subpoenaModel.update(data, {
          ...updateOptions,
          returning: true,
        })

      if (numberOfAffectedRows < 1) {
        if (throwOnZeroRows) {
          throw new InternalServerErrorException(
            `Could not update subpoena ${subpoenaId} of defendant ${defendantId} and case ${caseId}`,
          )
        }

        this.logger.error(
          `No rows affected when updating subpoena ${subpoenaId} of defendant ${defendantId} and case ${caseId}`,
        )
      }

      if (numberOfAffectedRows > 1) {
        // Tolerate failure, but log error
        this.logger.error(
          `Unexpected number of rows (${numberOfAffectedRows}) affected when updating subpoena ${subpoenaId} of defendant ${defendantId} and case ${caseId} with data:`,
          { data: Object.keys(data) },
        )
      }

      this.logger.debug(
        `Updated subpoena ${subpoenaId} of defendant ${defendantId} and case ${caseId}`,
      )

      return updatedSubpoenas[0]
    } catch (error) {
      this.logger.error(
        `Error updating subpoena ${subpoenaId} of defendant ${defendantId} and case ${caseId} with data:`,
        { data: Object.keys(data), error },
      )

      throw error
    }
  }
}
