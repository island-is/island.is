import { FindOptions, Transaction } from 'sequelize'

import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import { type Logger, LOGGER_PROVIDER } from '@island.is/logging'

import {
  AppealDecisionPartyRole,
  CaseAppealDecision,
} from '@island.is/judicial-system/types'

import { AppealDecision } from '../models/appealDecision.model'

// Identifies a party's decision row for a specific appealable ruling.
// rulingFileId null targets the case-level ruling. defendantId is required
// iff partyRole is DEFENDANT, civilClaimantId iff CIVIL_CLAIMANT - enforced
// by a DB CHECK constraint.
export interface AppealDecisionPartyKey {
  caseId: string
  rulingFileId?: string | null
  partyRole: AppealDecisionPartyRole
  defendantId?: string | null
  civilClaimantId?: string | null
}

interface UpdateAppealDecision {
  decision?: CaseAppealDecision | null
  announcement?: string | null
}

interface FindAllOptions {
  where?: FindOptions['where']
  transaction?: Transaction
}

interface UpsertAppealDecisionOptions {
  transaction: Transaction
}

interface UpdateAppealDecisionOptions {
  transaction: Transaction
}

@Injectable()
export class AppealDecisionRepositoryService {
  constructor(
    @InjectModel(AppealDecision)
    private readonly appealDecisionModel: typeof AppealDecision,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  async findAll(options?: FindAllOptions): Promise<AppealDecision[]> {
    try {
      this.logger.debug('Finding appeal decisions')

      const findOptions: FindOptions = {}

      if (options?.where) {
        findOptions.where = options.where
      }

      if (options?.transaction) {
        findOptions.transaction = options.transaction
      }

      const result = await this.appealDecisionModel.findAll(findOptions)

      this.logger.debug(`Found ${result.length} appeal decisions`)

      return result
    } catch (error) {
      this.logger.error('Error finding appeal decisions:', { error })

      throw error
    }
  }

  async update(
    appealDecisionId: string,
    data: UpdateAppealDecision,
    options: UpdateAppealDecisionOptions,
  ): Promise<void> {
    try {
      this.logger.debug(`Updating appeal decision ${appealDecisionId}`)

      const [numberOfAffectedRows] = await this.appealDecisionModel.update(
        data,
        {
          where: { id: appealDecisionId },
          transaction: options.transaction,
        },
      )

      if (numberOfAffectedRows < 1) {
        throw new InternalServerErrorException(
          `Could not update appeal decision ${appealDecisionId}`,
        )
      }

      this.logger.debug(`Updated appeal decision ${appealDecisionId}`)
    } catch (error) {
      this.logger.error(`Error updating appeal decision ${appealDecisionId}:`, {
        error,
      })

      throw error
    }
  }

  async upsert(
    party: AppealDecisionPartyKey,
    data: UpdateAppealDecision,
    options: UpsertAppealDecisionOptions,
  ): Promise<AppealDecision> {
    try {
      this.logger.debug(
        `Upserting appeal decision for ${party.partyRole} in case ${party.caseId}`,
      )

      const where = {
        caseId: party.caseId,
        rulingFileId: party.rulingFileId ?? null,
        partyRole: party.partyRole,
        defendantId: party.defendantId ?? null,
        civilClaimantId: party.civilClaimantId ?? null,
      }

      const existing = await this.appealDecisionModel.findOne({
        where,
        transaction: options.transaction,
      })

      if (existing) {
        const result = await existing.update(data, {
          transaction: options.transaction,
        })

        this.logger.debug(
          `Updated appeal decision ${result.id} for ${party.partyRole} in case ${party.caseId}`,
        )

        return result
      }

      const result = await this.appealDecisionModel.create(
        { ...where, ...data },
        { transaction: options.transaction },
      )

      this.logger.debug(
        `Created appeal decision ${result.id} for ${party.partyRole} in case ${party.caseId}`,
      )

      return result
    } catch (error) {
      this.logger.error(
        `Error upserting appeal decision for ${party.partyRole} in case ${party.caseId}:`,
        { error },
      )

      throw error
    }
  }
}
