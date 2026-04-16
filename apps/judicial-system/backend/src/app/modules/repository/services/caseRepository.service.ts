import omit from 'lodash/omit'
import pick from 'lodash/pick'
import {
  CountOptions,
  CreateOptions,
  FindAndCountOptions,
  FindAttributeOptions,
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
  CaseFileCategory,
  CaseState,
  DateType,
  EventType,
  IndictmentDecision,
  StringType,
} from '@island.is/judicial-system/types'

import { AppealCase } from '../models/appealCase.model'
import { Case } from '../models/case.model'
import { CaseFile } from '../models/caseFile.model'
import { CaseString } from '../models/caseString.model'
import { DateLog } from '../models/dateLog.model'
import { Defendant } from '../models/defendant.model'
import { DefendantEventLog } from '../models/defendantEventLog.model'
import { EventLog } from '../models/eventLog.model'
import { IndictmentCount } from '../models/indictmentCount.model'
import { Subpoena } from '../models/subpoena.model'
import { Verdict } from '../models/verdict.model'
import { Victim } from '../models/victim.model'
import {
  appealCaseFields,
  UpdateAppealCase,
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

interface SplitCaseOptions {
  transaction: Transaction
}

interface UpdateCaseOptions {
  transaction: Transaction
}

interface UpsertAppealCaseOptions {
  transaction: Transaction
}

@Injectable()
export class CaseRepositoryService {
  constructor(
    @InjectModel(Case) private readonly caseModel: typeof Case,
    @InjectModel(Defendant) private readonly defendantModel: typeof Defendant,
    @InjectModel(Subpoena) private readonly subpoenaModel: typeof Subpoena,
    @InjectModel(Verdict) private readonly verdictModel: typeof Verdict,
    @InjectModel(DefendantEventLog)
    private readonly defendantEventLogModel: typeof DefendantEventLog,
    @InjectModel(CaseString)
    private readonly caseStringModel: typeof CaseString,
    @InjectModel(DateLog) private readonly dateLogModel: typeof DateLog,
    @InjectModel(EventLog) private readonly eventLogModel: typeof EventLog,
    @InjectModel(Victim) private readonly victimModel: typeof Victim,
    @InjectModel(IndictmentCount)
    private readonly indictmentCountModel: typeof IndictmentCount,
    @InjectModel(CaseFile) private readonly caseFileModel: typeof CaseFile,
    @InjectModel(AppealCase)
    private readonly appealCaseModel: typeof AppealCase,
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
        await this.caseDefendantPoliceCaseNumberRepositoryService.resolvePoliceCaseNumbersForCases(
          [result],
          { transaction: options?.transaction },
        )
      }

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

      if (result && this.shouldResolvePoliceCaseNumbers(options?.attributes)) {
        await this.caseDefendantPoliceCaseNumberRepositoryService.resolvePoliceCaseNumbersForCases(
          [result],
          { transaction: options?.transaction },
        )
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
        await this.caseDefendantPoliceCaseNumberRepositoryService.resolvePoliceCaseNumbersForCases(
          results,
          { transaction: options?.transaction },
        )
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
        await this.caseDefendantPoliceCaseNumberRepositoryService.resolvePoliceCaseNumbersForCases(
          results.rows,
          { transaction: options?.transaction },
        )
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

      const { policeCaseNumbers, ...caseFields } = omit(
        data,
        appealCaseFields,
      ) as Omit<typeof data, typeof appealCaseFields[number]> & {
        policeCaseNumbers?: string[]
      }

      const result = await this.caseModel.create(caseFields, options)

      this.logger.debug(`Created a new case ${result.id}`)

      const appealData = pick(
        data,
        appealCaseFields,
      ) as Partial<UpdateAppealCase>

      if (Object.keys(appealData).length > 0) {
        await this.upsertAppealCase(result.id, appealData as UpdateAppealCase, {
          transaction: options.transaction,
        })
      }

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

  async split(
    caseId: string,
    defendantId: string,
    options: SplitCaseOptions,
  ): Promise<Case> {
    try {
      this.logger.debug(
        `Splitting defendant ${defendantId} from case ${caseId} into a new case`,
      )

      const fieldsToCopy: (keyof Case)[] = [
        'origin',
        'type',
        'indictmentSubtypes',
        'description',
        'courtId',
        'demands',
        'comments',
        'creatingProsecutorId',
        'prosecutorId',
        'courtEndTime',
        'rulingDate',
        'registrarId',
        'judgeId',
        'rulingModifiedHistory',
        'openedByDefender',
        'crimeScenes',
        'indictmentIntroduction',
        'requestDriversLicenseSuspension',
        'prosecutorsOfficeId',
        'indictmentDeniedExplanation',
        'indictmentHash',
        'hasCivilClaims',
      ]

      const transaction = options.transaction

      // Find the case to split
      const caseToSplit = await this.findById(caseId, { transaction })

      if (!caseToSplit) {
        // This is a programmer error, so we throw an exception
        throw new InternalServerErrorException(`Case ${caseId} not found`)
      }

      // Create the new case
      const createOptions: CreateOptions = {}

      if (transaction) {
        createOptions.transaction = transaction
      }

      const result = await this.caseModel.create(
        {
          ...pick(caseToSplit, fieldsToCopy),
          state: CaseState.SUBMITTED,
          splitCaseId: caseId,
          // The new case should have court session support
          withCourtSessions: true,
          // The new case is postponed indefinitely by default
          indictmentDecision: IndictmentDecision.POSTPONING,
        },
        createOptions,
      )

      const { id: splitCaseId } = result

      await this.caseDefendantPoliceCaseNumberRepositoryService.replaceUnassignedFromPoliceCaseNumbersArray(
        splitCaseId,
        caseToSplit.policeCaseNumbers ?? [],
        { transaction },
      )

      // Create a promise collection to await later
      const promises: Promise<unknown>[] = []

      // Move the defendant to the new case
      const defendantUpdateOptions: UpdateOptions = {
        where: { id: defendantId, caseId },
        transaction,
      }

      promises.push(
        this.defendantModel.update(
          { caseId: splitCaseId },
          defendantUpdateOptions,
        ),
      )

      // Move the defandant's subpoenas to the new case
      const subpoenaUpdateOptions: UpdateOptions = {
        where: { caseId, defendantId },
        transaction,
      }

      promises.push(
        this.subpoenaModel.update(
          { caseId: splitCaseId },
          subpoenaUpdateOptions,
        ),
      )

      // Move the defendant's verdicts to the new case
      const verdictUpdateOptions: UpdateOptions = {
        where: { caseId, defendantId },
        transaction,
      }

      promises.push(
        this.verdictModel.update({ caseId: splitCaseId }, verdictUpdateOptions),
      )

      // Move the defendant's event logs to the new case
      const defendantEventLogUpdateOptions: UpdateOptions = {
        where: { caseId, defendantId },
        transaction,
      }

      promises.push(
        this.defendantEventLogModel.update(
          { caseId: splitCaseId },
          defendantEventLogUpdateOptions,
        ),
      )

      // Set the postponedIndefinitelyExplanation case string
      const caseStringCreateOptions: CreateOptions = { transaction }

      promises.push(
        this.caseStringModel.create(
          {
            caseId: splitCaseId,
            stringType: StringType.POSTPONED_INDEFINITELY_EXPLANATION,
            value: `Ákærði klofinn frá máli ${caseToSplit.courtCaseNumber}.`,
          },
          caseStringCreateOptions,
        ),
      )

      // Copy the civil demands case string to the new case
      const civilDemands = await this.caseStringModel.findOne({
        where: { caseId, stringType: StringType.CIVIL_DEMANDS },
        transaction,
      })

      if (civilDemands) {
        promises.push(
          this.caseStringModel.create(
            { ...civilDemands.toJSON(), id: undefined, caseId: splitCaseId },
            caseStringCreateOptions,
          ),
        )
      }

      // Copy arraignment date date log to the new case
      const arraignmentDate = await this.dateLogModel.findOne({
        where: { caseId, dateType: DateType.ARRAIGNMENT_DATE },
        transaction,
      })

      if (arraignmentDate) {
        const dateLogCreateOptions: CreateOptions = { transaction }

        promises.push(
          this.dateLogModel.create(
            { ...arraignmentDate.toJSON(), id: undefined, caseId: splitCaseId },
            dateLogCreateOptions,
          ),
        )
      }

      // Copy relevant event logs to the new case
      const eventLogs = await this.eventLogModel.findAll({
        where: {
          caseId,
          eventType: [
            EventType.INDICTMENT_CONFIRMED,
            EventType.CASE_SENT_TO_COURT,
            EventType.CASE_RECEIVED_BY_COURT,
          ],
        },
        transaction,
      })

      const eventLogCreateOptions: CreateOptions = { transaction }

      for (const eventLog of eventLogs) {
        promises.push(
          this.eventLogModel.create(
            { ...eventLog.toJSON(), id: undefined, caseId: splitCaseId },
            eventLogCreateOptions,
          ),
        )
      }

      // Copy all victims to the new case
      const victims = await this.victimModel.findAll({
        where: { caseId },
        transaction,
      })

      const victimCreateOptions: CreateOptions = { transaction }

      for (const victim of victims) {
        promises.push(
          this.victimModel.create(
            { ...victim.toJSON(), id: undefined, caseId: splitCaseId },
            victimCreateOptions,
          ),
        )
      }

      // Copy all indicment counts to the new case
      const indictmentCounts = await this.indictmentCountModel.findAll({
        where: { caseId },
        transaction,
      })

      const indictmentCountCreateOptions: CreateOptions = { transaction }

      for (const indictmentCount of indictmentCounts) {
        promises.push(
          this.indictmentCountModel.create(
            { ...indictmentCount.toJSON(), id: undefined, caseId: splitCaseId },
            indictmentCountCreateOptions,
          ),
        )
      }

      // Copy all indictment count offenses to the new case
      // Nothing to do here, offenses are only linked to indictment counts
      // Consider removing case id from other tables not directly linked to cases

      // Move the defendant's case files to the new case
      const caseFilesCategoriesToMove = [
        CaseFileCategory.CRIMINAL_RECORD,
        CaseFileCategory.COST_BREAKDOWN,
        CaseFileCategory.CASE_FILE,
        CaseFileCategory.PROSECUTOR_CASE_FILE,
        CaseFileCategory.DEFENDANT_CASE_FILE,
        CaseFileCategory.CIVIL_CLAIM,
        CaseFileCategory.CIVIL_CLAIMANT_LEGAL_SPOKESPERSON_CASE_FILE,
        CaseFileCategory.CIVIL_CLAIMANT_SPOKESPERSON_CASE_FILE,
        CaseFileCategory.INDEPENDENT_DEFENDANT_CASE_FILE,
      ]

      const caseFileUpdateOptions: UpdateOptions = {
        where: { caseId, defendantId, category: caseFilesCategoriesToMove },
        transaction,
      }

      promises.push(
        this.caseFileModel.update(
          { caseId: splitCaseId },
          caseFileUpdateOptions,
        ),
      )

      // Copy all case files linked to the case but not to any defendant
      const caseFiles = await this.caseFileModel.findAll({
        where: {
          caseId,
          defendantId: null,
          category: caseFilesCategoriesToMove,
        },
        transaction,
      })

      const caseFileCreateOptions: CreateOptions = { transaction }

      for (const caseFile of caseFiles) {
        promises.push(
          this.caseFileModel.create(
            { ...caseFile.toJSON(), id: undefined, caseId: splitCaseId },
            caseFileCreateOptions,
          ),
        )
      }

      await Promise.all(promises)

      await this.caseDefendantPoliceCaseNumberRepositoryService.moveAssignedRowsToCaseForDefendant(
        caseId,
        splitCaseId,
        defendantId,
        { transaction },
      )

      await this.caseDefendantPoliceCaseNumberRepositoryService.resolvePoliceCaseNumbersForCases(
        [result],
        { transaction },
      )

      this.logger.debug(
        `Split defendant ${defendantId} from case ${caseId} into a new case ${result.id}`,
      )

      return result
    } catch (error) {
      this.logger.error(
        `Error splitting defendant ${defendantId} from case ${caseId} into a new case`,
        { error },
      )

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

      const hasPoliceCaseNumbersUpdate = 'policeCaseNumbers' in data
      const caseData = omit(data, [...appealCaseFields, 'policeCaseNumbers'])

      let updatedCase: Case

      if (Object.keys(caseData).length > 0) {
        const [numberOfAffectedRows, cases] = await this.caseModel.update(
          caseData,
          {
            ...updateOptions,
            returning: true,
          },
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

      const appealData = pick(
        data,
        appealCaseFields,
      ) as Partial<UpdateAppealCase>

      if (Object.keys(appealData).length > 0) {
        await this.upsertAppealCase(caseId, appealData as UpdateAppealCase, {
          transaction: options.transaction,
        })
      }

      if (hasPoliceCaseNumbersUpdate) {
        await this.caseDefendantPoliceCaseNumberRepositoryService.replaceUnassignedFromPoliceCaseNumbersArray(
          caseId,
          data.policeCaseNumbers ?? [],
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

  async upsertAppealCase(
    caseId: string,
    data: UpdateAppealCase,
    options: UpsertAppealCaseOptions,
  ): Promise<AppealCase> {
    try {
      this.logger.debug(`Upserting appeal case for case ${caseId} with data:`, {
        data: Object.keys(data),
      })

      const existing = await this.appealCaseModel.findOne({
        where: { caseId },
        transaction: options.transaction,
      })

      const [result] = await this.appealCaseModel.upsert(
        { ...existing?.toJSON(), ...data, caseId },
        {
          transaction: options.transaction,
          returning: true,
          conflictFields: ['case_id'],
        },
      )

      this.logger.debug(`Upserted appeal case for case ${caseId}`)

      return result
    } catch (error) {
      this.logger.error(
        `Error upserting appeal case for case ${caseId} with data:`,
        { data: Object.keys(data), error },
      )

      throw error
    }
  }
}
