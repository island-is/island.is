import { FindAndCountOptions, FindOptions, Transaction } from 'sequelize'

import { Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import { type Logger, LOGGER_PROVIDER } from '@island.is/logging'

import { Case } from '../models/case.model'

interface FindByIdOptions {
  transaction?: Transaction
  include?: FindOptions['include']
}

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

interface FindAndCountAllOptions {
  where?: FindAndCountOptions['where']
  transaction?: Transaction
  include?: FindAndCountOptions['include']
  attributes?: FindAndCountOptions['attributes']
  order?: FindAndCountOptions['order']
  limit?: FindAndCountOptions['limit']
  offset?: FindAndCountOptions['offset']
  distinct?: FindAndCountOptions['distinct']
  raw?: FindAndCountOptions['raw']
}

@Injectable()
export class CaseRepositoryService {
  constructor(
    @InjectModel(Case) private readonly caseModel: typeof Case,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  async findById(id: string, options?: FindByIdOptions): Promise<Case | null> {
    try {
      this.logger.debug(`Finding case by ID: ${id}`)

      const findOptions: FindOptions = {}

      if (options?.transaction) {
        findOptions.transaction = options.transaction
      }

      if (options?.include) {
        findOptions.include = options.include
      }

      const result = await this.caseModel.findByPk(id, findOptions)

      this.logger.debug(`Case ${id} ${result ? 'found' : 'not found'}`)

      return result
    } catch (error) {
      this.logger.error(`Error finding case by ID ${id}:`, error)

      throw error
    }
  }

  async findOne(options?: FindOneOptions): Promise<Case | null> {
    try {
      this.logger.debug(`Finding case with conditions:`, options?.where)

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

      const result = await this.caseModel.findOne(findOptions)

      this.logger.debug(
        `Case with conditions ${result ? 'found' : 'not found'}`,
      )

      return result
    } catch (error) {
      this.logger.error(`Error finding case with conditions:`, error)

      throw error
    }
  }

  async findAll(options?: FindAllOptions): Promise<Case[]> {
    try {
      this.logger.debug(`Finding all cases with conditions:`, options?.where)

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

      const results = await this.caseModel.findAll(findOptions)

      this.logger.debug(`Found ${results.length} cases`)

      return results
    } catch (error) {
      this.logger.error(`Error finding all cases:`, error)

      throw error
    }
  }

  async findAndCountAll(options?: FindAndCountAllOptions): Promise<{
    count: number
    rows: Case[]
  }> {
    try {
      this.logger.debug(
        `Finding and counting all cases with conditions:`,
        options?.where,
      )

      const findOptions: FindAndCountOptions = {}

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

      if (options?.distinct !== undefined) {
        findOptions.distinct = options.distinct
      }

      if (options?.raw !== undefined) {
        findOptions.raw = options.raw
      }

      const results = await this.caseModel.findAndCountAll(findOptions)

      this.logger.debug(
        `Found and counted ${results.count} total cases, returning ${results.rows.length} rows`,
      )

      return results
    } catch (error) {
      this.logger.error(`Error finding and counting all cases:`, error)

      throw error
    }
  }
}
