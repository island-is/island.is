import {
  CountOptions,
  FindAndCountOptions,
  FindAttributeOptions,
  FindOptions,
  Op,
  Transaction,
  UpdateOptions,
  WhereOptions,
} from 'sequelize'

import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import { type Logger, LOGGER_PROVIDER } from '@island.is/logging'

import {
  CaseState,
  CaseType,
  isIndictmentCase,
} from '@island.is/judicial-system/types'

import { Case } from '../models/case.model'
import {
  caseInclude,
  caseStatisticsInclude,
  indictmentCaseEventExportInclude,
  requestCaseEventExportInclude,
  UpdateCase,
} from '../types/caseRepository.types'
import { CaseDefendantPoliceCaseNumberRepositoryService } from './caseDefendantPoliceCaseNumber.repository.service'

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
  group?: FindOptions['group']
  having?: FindOptions['having']
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

interface CountCaseOptions {
  where?: CountOptions['where']
  transaction?: Transaction
  include?: CountOptions['include']
  distinct?: CountOptions['distinct']
}

interface CreateCaseOptions {
  transaction: Transaction
}

interface UpdateCaseOptions {
  transaction: Transaction
}

// The period the statistics are asked for, and the institution they are asked
// about - an institution matches a case it either prosecutes or presides over.
export type CaseStatisticsFilter = {
  from?: Date
  to?: Date
  institutionId?: string
}

@Injectable()
export class CaseRepositoryService {
  constructor(
    @InjectModel(Case) private readonly caseModel: typeof Case,
    // Every case read resolves its police case numbers from the junction
    // table, and every write syncs them back, so the aggregate keeps this one
    // repository edge for its own model's sake (see the plan file's E2 row)
    private readonly caseDefendantPoliceCaseNumberRepositoryService: CaseDefendantPoliceCaseNumberRepositoryService,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  /**
   * When the Sequelize query includes `policeCaseNumbers`, resolve that field from the junction table.
   */
  private shouldResolvePoliceCaseNumbers(
    attributes?: FindAttributeOptions,
  ): boolean {
    if (!attributes) return true
    if (Array.isArray(attributes)) {
      return attributes.some((attr) => attr === 'policeCaseNumbers')
    }
    return !attributes.exclude?.includes('policeCaseNumbers')
  }

  private async resolvePoliceCaseNumbersForCaseGraph(
    cases: Case[],
    options?: { transaction?: Transaction },
  ): Promise<void> {
    const byId = new Map<string, Case>()

    // Add merged cases so we resolve their police case numbers too
    for (const c of cases) {
      if (c.id) {
        byId.set(c.id, c)
      }
      c.mergedCases?.forEach((mergedCase) => {
        if (mergedCase.id) {
          byId.set(mergedCase.id, mergedCase)
        }
      })
    }

    const toResolve = [...byId.values()]

    await this.caseDefendantPoliceCaseNumberRepositoryService.resolvePoliceCaseNumbersForCases(
      toResolve,
      { transaction: options?.transaction },
    )
  }

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

      if (result) {
        await this.resolvePoliceCaseNumbersForCaseGraph([result], {
          transaction: options?.transaction,
        })
      }

      return result
    } catch (error) {
      this.logger.error(`Error finding case by ID ${id}:`, { error })

      throw error
    }
  }

  // The cases merged into a given case, oldest merge first. Read through the
  // aggregate's own path so each merged case carries its police case numbers.
  async findAllMergedToCase(
    caseId: string,
    options?: { transaction?: Transaction },
  ): Promise<Case[]> {
    try {
      this.logger.debug(`Finding cases merged into case ${caseId}`)

      const results = await this.caseModel.findAll({
        where: { mergeCaseId: caseId },
        order: [['created', 'ASC']],
        transaction: options?.transaction,
      })

      this.logger.debug(
        `Found ${results.length} cases merged into case ${caseId}`,
      )

      if (results.length > 0) {
        await this.resolvePoliceCaseNumbersForCaseGraph(results, {
          transaction: options?.transaction,
        })
      }

      return results
    } catch (error) {
      this.logger.error(`Error finding cases merged into case ${caseId}:`, {
        error,
      })

      throw error
    }
  }

  async findParentCaseId(id: string): Promise<string | null | undefined> {
    const result = await this.caseModel.findByPk(id, {
      attributes: ['parentCaseId'],
    })
    return result?.parentCaseId
  }

  async findOriginalAncestorId(theCase: Case): Promise<string> {
    // Split indictment continuations point back to the original via splitCaseId
    if (isIndictmentCase(theCase.type) && theCase.splitCaseId) {
      return theCase.splitCaseId
    }

    // Extended request cases and duplicated indictment drafts point back to
    // their origin via parentCaseId - walk the chain to the original ancestor
    let originalAncestorId = theCase.id
    let parentCaseId: string | null | undefined = theCase.parentCaseId

    while (parentCaseId) {
      originalAncestorId = parentCaseId
      parentCaseId = await this.findParentCaseId(parentCaseId)
    }

    return originalAncestorId
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

      if (result && this.shouldResolvePoliceCaseNumbers(options?.attributes)) {
        await this.resolvePoliceCaseNumbersForCaseGraph([result], {
          transaction: options?.transaction,
        })
      }

      return result
    } catch (error) {
      this.logger.error('Error finding case with conditions:', {
        where: Object.keys(options?.where ?? {}),
        error,
      })

      throw error
    }
  }

  /**
   * Reads a live case - neither deleted nor archived - with its row locked for
   * the rest of the transaction, so the caller can decide a mutation against a
   * case no one else can change in the meantime.
   *
   * The lock is taken by a query of its own rather than by locking the
   * aggregate read: Postgres cannot lock the nullable side of an outer join,
   * and `caseInclude` is a tree of them. Scoping the lock to the case row
   * (`FOR UPDATE OF "Case"`) does not help either, because Sequelize passes
   * `lock` down to the `separate: true` includes, where that table is not in
   * the FROM clause. The aggregate read that follows runs in the same
   * transaction and therefore sees the row it just locked.
   */
  async findLiveByIdForUpdate(
    id: string,
    transaction: Transaction,
  ): Promise<Case | null> {
    const where = {
      id,
      state: { [Op.not]: CaseState.DELETED },
      isArchived: false,
    }

    const locked = await this.lockByIdForUpdate(id, transaction, where)

    if (!locked) {
      return null
    }

    return this.findOne({ include: caseInclude, where, transaction })
  }

  /**
   * Takes the case row's write lock for the rest of the transaction without
   * reading the case aggregate, for a caller that already holds the case and
   * only needs its decision serialized against other writers on the same case.
   * Returns whether the row was there to lock.
   *
   * See findLiveByIdForUpdate for why the lock is a query of its own.
   */
  async lockByIdForUpdate(
    id: string,
    transaction: Transaction,
    where: WhereOptions = { id },
  ): Promise<boolean> {
    try {
      this.logger.debug(`Locking case ${id} for update`)

      const lockedCase = await this.caseModel.findOne({
        attributes: ['id'],
        where,
        lock: Transaction.LOCK.UPDATE,
        transaction,
      })

      if (!lockedCase) {
        this.logger.debug(`Case ${id} not found`)

        return false
      }

      return true
    } catch (error) {
      this.logger.error(`Error locking case ${id} for update:`, { error })

      throw error
    }
  }

  private caseStatisticsWhere(filter: CaseStatisticsFilter): WhereOptions {
    return {
      // Cases that never left the prosecutor's desk are not part of any count
      state: {
        [Op.not]: [
          CaseState.DELETED,
          CaseState.DRAFT,
          CaseState.NEW,
          CaseState.WAITING_FOR_CONFIRMATION,
        ],
      },
      ...(filter.from || filter.to
        ? {
            created: {
              ...(filter.from ? { [Op.gte]: filter.from } : {}),
              ...(filter.to ? { [Op.lte]: filter.to } : {}),
            },
          }
        : {}),
      ...(filter.institutionId
        ? {
            [Op.or]: [
              { courtId: filter.institutionId },
              { prosecutorsOfficeId: filter.institutionId },
            ],
          }
        : {}),
    }
  }

  // Every case that counts towards the statistics for a period, with the event
  // that confirmed its indictment - what the caller needs to count cases and
  // measure how long a ruling took.
  async findCasesForStatistics(filter: CaseStatisticsFilter): Promise<Case[]> {
    try {
      this.logger.debug('Finding cases for statistics')

      const results = await this.caseModel.findAll({
        where: this.caseStatisticsWhere(filter),
        include: caseStatisticsInclude,
      })

      this.logger.debug(`Found ${results.length} cases for statistics`)

      if (results.length > 0) {
        await this.resolvePoliceCaseNumbersForCaseGraph(results)
      }

      return results
    } catch (error) {
      this.logger.error('Error finding cases for statistics:', { error })

      throw error
    }
  }

  // Every request case, oldest first, with the graph the event export derives
  // its rows from. The export is not bounded by a period here - it filters the
  // events it derives, not the cases it derives them from.
  async findRequestCasesForEventExport(): Promise<Case[]> {
    try {
      this.logger.debug('Finding request cases for the event export')

      const results = await this.caseModel.findAll({
        where: { type: { [Op.not]: [CaseType.INDICTMENT] } },
        order: [['created', 'ASC']],
        include: requestCaseEventExportInclude,
      })

      this.logger.debug(
        `Found ${results.length} request cases for the event export`,
      )

      if (results.length > 0) {
        await this.resolvePoliceCaseNumbersForCaseGraph(results)
      }

      return results
    } catch (error) {
      this.logger.error('Error finding request cases for the event export:', {
        error,
      })

      throw error
    }
  }

  // Every indictment case, oldest first, with the graph the event export
  // derives its rows from - see findRequestCasesForEventExport on the period.
  async findIndictmentCasesForEventExport(): Promise<Case[]> {
    try {
      this.logger.debug('Finding indictment cases for the event export')

      const results = await this.caseModel.findAll({
        where: { type: CaseType.INDICTMENT },
        order: [['created', 'ASC']],
        include: indictmentCaseEventExportInclude,
      })

      this.logger.debug(
        `Found ${results.length} indictment cases for the event export`,
      )

      if (results.length > 0) {
        await this.resolvePoliceCaseNumbersForCaseGraph(results)
      }

      return results
    } catch (error) {
      this.logger.error(
        'Error finding indictment cases for the event export:',
        { error },
      )

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

      if (options?.group) {
        findOptions.group = options.group
      }

      if (options?.having) {
        findOptions.having = options.having
      }

      const results = await this.caseModel.findAll(findOptions)

      this.logger.debug(`Found ${results.length} cases`)

      if (
        results.length > 0 &&
        this.shouldResolvePoliceCaseNumbers(options?.attributes)
      ) {
        await this.resolvePoliceCaseNumbersForCaseGraph(results, {
          transaction: options?.transaction,
        })
      }

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

      if (
        results.rows.length > 0 &&
        !options?.raw &&
        this.shouldResolvePoliceCaseNumbers(options?.attributes)
      ) {
        await this.resolvePoliceCaseNumbersForCaseGraph(results.rows, {
          transaction: options?.transaction,
        })
      }

      return results
    } catch (error) {
      this.logger.error(
        'Error finding and counting all cases with conditions:',
        { where: Object.keys(options?.where ?? {}), error },
      )

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

  async create(data: Partial<Case>, options: CreateCaseOptions): Promise<Case> {
    try {
      this.logger.debug('Creating a new case with data:', {
        data: Object.keys(data),
      })

      const { policeCaseNumbers, ...caseFields } = data

      const result = await this.caseModel.create(caseFields, options)

      this.logger.debug(`Created a new case ${result.id}`)

      await this.caseDefendantPoliceCaseNumberRepositoryService.replaceUnassignedFromPoliceCaseNumbersArray(
        result.id,
        policeCaseNumbers ?? [],
        { transaction: options.transaction },
      )

      await this.caseDefendantPoliceCaseNumberRepositoryService.resolvePoliceCaseNumbersForCases(
        [result],
        { transaction: options.transaction },
      )

      return result
    } catch (error) {
      this.logger.error('Error creating a new case with data:', {
        data: Object.keys(data),
        error,
      })

      throw error
    }
  }

  async update(
    caseId: string,
    data: UpdateCase,
    options: UpdateCaseOptions,
  ): Promise<Case> {
    try {
      this.logger.debug(`Updating case ${caseId} with data:`, {
        data: Object.keys(data),
      })

      const updateOptions: UpdateOptions = {
        where: { id: caseId },
        transaction: options.transaction,
      }

      const { policeCaseNumbers, ...caseFields } = data

      let updatedCase: Case

      if (Object.keys(caseFields).length > 0) {
        const [numberOfAffectedRows, cases] = await this.caseModel.update(
          caseFields,
          { ...updateOptions, returning: true },
        )

        if (numberOfAffectedRows < 1) {
          throw new InternalServerErrorException(
            `Could not update case ${caseId}`,
          )
        }

        if (numberOfAffectedRows > 1) {
          // Tolerate failure, but log error
          this.logger.error(
            `Unexpected number of rows (${numberOfAffectedRows}) affected when updating case ${caseId} with data:`,
            { data: Object.keys(data) },
          )
        }

        updatedCase = cases[0]
      } else {
        const theCase = await this.caseModel.findByPk(caseId, {
          transaction: options.transaction,
        })

        if (!theCase) {
          throw new InternalServerErrorException(
            `Could not update case ${caseId}`,
          )
        }

        updatedCase = theCase
      }

      this.logger.debug(`Updated case ${caseId}`)

      if (policeCaseNumbers) {
        await this.caseDefendantPoliceCaseNumberRepositoryService.replaceUnassignedFromPoliceCaseNumbersArray(
          caseId,
          policeCaseNumbers ?? [],
          { transaction: options.transaction },
        )
      }

      await this.caseDefendantPoliceCaseNumberRepositoryService.resolvePoliceCaseNumbersForCases(
        [updatedCase],
        { transaction: options.transaction },
      )

      return updatedCase
    } catch (error) {
      this.logger.error(`Error updating case ${caseId} with data:`, {
        data: Object.keys(data),
        error,
      })

      throw error
    }
  }
}
