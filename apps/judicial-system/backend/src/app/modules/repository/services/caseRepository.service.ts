import {
  CountOptions,
  CreateOptions,
  FindAndCountOptions,
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

import { Case } from '../models/case.model'
import { UpdateCase } from '../types/caseRepository.types'

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

interface CreateCaseOptions {
  transaction?: Transaction
}

interface UpdateCaseOptions {
  transaction?: Transaction
}

interface CountCaseOptions {
  where?: CountOptions['where']
  transaction?: Transaction
  include?: CountOptions['include']
  distinct?: CountOptions['distinct']
}

@Injectable()
export class CaseRepositoryService {
  constructor(
    @InjectModel(Case) private readonly caseModel: typeof Case,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  async findById(id: string, options?: FindByIdOptions): Promise<Case | null> {
    try {
      this.logger.debug(`Finding case by ID ${id}`)

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
      this.logger.error(`Error finding case by ID ${id}:`, { error })

      throw error
    }
  }

  async findOne(options?: FindOneOptions): Promise<Case | null> {
    try {
      this.logger.debug('Finding case with conditions:', {
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

      const result = await this.caseModel.findOne(findOptions)

      this.logger.debug(`Case ${result ? 'found' : 'not found'}`)

      return result
    } catch (error) {
      this.logger.error('Error finding case with conditions:', {
        where: Object.keys(options?.where ?? {}),
        error,
      })

      throw error
    }
  }

  async findAll(options?: FindAllOptions): Promise<Case[]> {
    try {
      this.logger.debug('Finding all cases with conditions:', {
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

      const results = await this.caseModel.findAll(findOptions)

      this.logger.debug(`Found ${results.length} cases`)

      return results
    } catch (error) {
      this.logger.error('Error finding all cases with conditions:', {
        where: Object.keys(options?.where ?? {}),
        error,
      })

      throw error
    }
  }

  async findAndCountAll(options?: FindAndCountAllOptions): Promise<{
    count: number
    rows: Case[]
  }> {
    try {
      this.logger.debug('Finding and counting all cases with conditions:', {
        where: Object.keys(options?.where ?? {}),
      })

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
      this.logger.error(
        'Error finding and counting all cases with conditions:',
        { where: Object.keys(options?.where ?? {}), error },
      )

      throw error
    }
  }

  async create(
    data: Partial<Case>,
    options?: CreateCaseOptions,
  ): Promise<Case> {
    try {
      this.logger.debug('Creating a new case with data:', {
        data: Object.keys(data ?? {}),
      })

      const createOptions: CreateOptions = {}

      if (options?.transaction) {
        createOptions.transaction = options.transaction
      }

      const result = await this.caseModel.create(data, createOptions)

      this.logger.debug(`Created a new case ${result.id}`)

      return result
    } catch (error) {
      this.logger.error('Error creating a new case with data:', {
        data: Object.keys(data ?? {}),
        error,
      })

      throw error
    }
  }

  async update(
    caseId: string,
    data: UpdateCase,
    options?: UpdateCaseOptions,
  ): Promise<Case> {
    try {
      this.logger.debug(`Updating case ${caseId} with data:`, {
        data: Object.keys(data ?? {}),
      })

      const updateOptions: UpdateOptions = {
        where: { id: caseId },
      }

      if (options?.transaction) {
        updateOptions.transaction = options.transaction
      }

      const [numberOfAffectedRows, cases] = await this.caseModel.update(data, {
        ...updateOptions,
        returning: true,
      })

      if (numberOfAffectedRows < 1) {
        throw new InternalServerErrorException(
          `Could not update case ${caseId}`,
        )
      }

      if (numberOfAffectedRows > 1) {
        // Tolerate failure, but log error
        this.logger.error(
          `Unexpected number of rows (${numberOfAffectedRows}) affected when updating case ${caseId} with data:`,
          { data: Object.keys(data ?? {}) },
        )
      }

      this.logger.debug(`Updated case ${caseId}`)

      return cases[0]
    } catch (error) {
      this.logger.error(`Error updating case ${caseId} with data:`, {
        data: Object.keys(data ?? {}),
        error,
      })

      throw error
    }
  }

  async count(options?: CountCaseOptions): Promise<number> {
    try {
      this.logger.debug('Counting cases with conditions:', {
        where: Object.keys(options?.where ?? {}),
      })

      const countOptions: CountOptions = {}

      if (options?.where) {
        countOptions.where = options.where
      }

      if (options?.transaction) {
        countOptions.transaction = options.transaction
      }

      if (options?.include) {
        countOptions.include = options.include
      }

      if (options?.distinct !== undefined) {
        countOptions.distinct = options.distinct
      }

      const result = await this.caseModel.count(countOptions)

      this.logger.debug(`Counted ${result} case(s)`)

      return result
    } catch (error) {
      this.logger.error('Error counting cases with conditions:', {
        where: Object.keys(options?.where ?? {}),
        error,
      })

      throw error
    }
  }
}
