import { Transaction } from 'sequelize'

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
// iff partyRole is DEFENDANT and rulingFileId is not null,
// civilClaimantId iff CIVIL_CLAIMANT - enforced by a DB CHECK constraint.
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
  withdrawnDate?: Date | null
}

// The party key as a where clause. Absent ids become null: Sequelize rejects
// undefined in a where, and the unique index treats nulls as equal.
const toPartyWhere = (party: AppealDecisionPartyKey) => ({
  caseId: party.caseId,
  rulingFileId: party.rulingFileId ?? null,
  partyRole: party.partyRole,
  defendantId: party.defendantId ?? null,
  civilClaimantId: party.civilClaimantId ?? null,
})

@Injectable()
export class AppealDecisionRepositoryService {
  constructor(
    @InjectModel(AppealDecision)
    private readonly appealDecisionModel: typeof AppealDecision,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  // Every party's decision for a ruling.
  async findAllForRuling(
    caseId: string,
    rulingFileId: string,
    options: { transaction: Transaction },
  ): Promise<AppealDecision[]> {
    try {
      this.logger.debug(
        `Finding appeal decisions of case ${caseId} for ruling ${rulingFileId}`,
      )

      const result = await this.appealDecisionModel.findAll({
        where: { caseId, rulingFileId },
        transaction: options.transaction,
      })

      this.logger.debug(
        `Found ${result.length} appeal decisions of case ${caseId} for ruling ${rulingFileId}`,
      )

      return result
    } catch (error) {
      this.logger.error(
        `Error finding appeal decisions of case ${caseId} for ruling ${rulingFileId}:`,
        { error },
      )

      throw error
    }
  }

  // Takes a row lock on every party's decision for a ruling, so concurrent
  // writers to the same ruling's decisions serialize on it. Rows are locked in
  // id order, the same order in every transaction, so two lockers cannot
  // deadlock on each other. Lock before writing: a transaction that first
  // updates its own row and then locks the rest can deadlock against another
  // doing the same.
  async lockAllForRuling(
    caseId: string,
    rulingFileId: string,
    options: { transaction: Transaction },
  ): Promise<void> {
    try {
      this.logger.debug(
        `Locking appeal decisions of case ${caseId} for ruling ${rulingFileId}`,
      )

      await this.appealDecisionModel.findAll({
        where: { caseId, rulingFileId },
        order: [['id', 'ASC']],
        lock: Transaction.LOCK.UPDATE,
        transaction: options.transaction,
      })
    } catch (error) {
      this.logger.error(
        `Error locking appeal decisions of case ${caseId} for ruling ${rulingFileId}:`,
        { error },
      )

      throw error
    }
  }

  async existsForRuling(
    caseId: string,
    rulingFileId: string,
    options: { transaction: Transaction },
  ): Promise<boolean> {
    try {
      this.logger.debug(
        `Checking for appeal decisions of case ${caseId} for ruling ${rulingFileId}`,
      )

      const result = await this.appealDecisionModel.findOne({
        where: { caseId, rulingFileId },
        transaction: options.transaction,
      })

      return Boolean(result)
    } catch (error) {
      this.logger.error(
        `Error checking for appeal decisions of case ${caseId} for ruling ${rulingFileId}:`,
        { error },
      )

      throw error
    }
  }

  // The party's decision row, or null if the party has recorded none yet.
  async findByParty(
    party: AppealDecisionPartyKey,
    options: { transaction: Transaction },
  ): Promise<AppealDecision | null> {
    try {
      this.logger.debug(
        `Finding appeal decision for ${party.partyRole} in case ${party.caseId}`,
      )

      return await this.appealDecisionModel.findOne({
        where: toPartyWhere(party),
        transaction: options.transaction,
      })
    } catch (error) {
      this.logger.error(
        `Error finding appeal decision for ${party.partyRole} in case ${party.caseId}:`,
        { error },
      )

      throw error
    }
  }

  async update(
    appealDecisionId: string,
    data: UpdateAppealDecision,
    options: { transaction: Transaction },
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

  // Re-points every party's decision for a ruling onto a different ruling file.
  // Used when a court session is corrected to swap its ruling order file: the
  // same ruling is now represented by a new file, so the recorded decisions
  // move with it instead of being discarded.
  async updateRulingFile(
    caseId: string,
    fromRulingFileId: string,
    toRulingFileId: string,
    options: { transaction: Transaction },
  ): Promise<number> {
    try {
      this.logger.debug(
        `Re-pointing appeal decisions of case ${caseId} from ruling ${fromRulingFileId} to ${toRulingFileId}`,
      )

      const [numberOfAffectedRows] = await this.appealDecisionModel.update(
        { rulingFileId: toRulingFileId },
        {
          where: { caseId, rulingFileId: fromRulingFileId },
          transaction: options.transaction,
        },
      )

      this.logger.debug(
        `Re-pointed ${numberOfAffectedRows} appeal decisions of case ${caseId} to ruling ${toRulingFileId}`,
      )

      return numberOfAffectedRows
    } catch (error) {
      this.logger.error(
        `Error re-pointing appeal decisions of case ${caseId} from ruling ${fromRulingFileId} to ${toRulingFileId}:`,
        { error },
      )

      throw error
    }
  }

  // Removes every party's decision for a ruling. Used when a court session stops
  // being a ruling order (its ruling type moves away from ORDER): there is no
  // file to carry the decisions onto, so they must not be left orphaned.
  async deleteAllForRuling(
    caseId: string,
    rulingFileId: string,
    options: { transaction: Transaction },
  ): Promise<number> {
    try {
      this.logger.debug(
        `Deleting appeal decisions of case ${caseId} for ruling ${rulingFileId}`,
      )

      const numberOfDeletedRows = await this.appealDecisionModel.destroy({
        where: { caseId, rulingFileId },
        transaction: options.transaction,
      })

      this.logger.debug(
        `Deleted ${numberOfDeletedRows} appeal decisions of case ${caseId} for ruling ${rulingFileId}`,
      )

      return numberOfDeletedRows
    } catch (error) {
      this.logger.error(
        `Error deleting appeal decisions of case ${caseId} for ruling ${rulingFileId}:`,
        { error },
      )

      throw error
    }
  }

  async upsert(
    party: AppealDecisionPartyKey,
    data: UpdateAppealDecision,
    options: { transaction: Transaction },
  ): Promise<AppealDecision> {
    try {
      this.logger.debug(
        `Upserting appeal decision for ${party.partyRole} in case ${party.caseId}`,
      )

      const key = toPartyWhere(party)

      // Atomic insert-or-update keyed on the party. A read-then-write would
      // race two concurrent requests for the same party into a duplicate
      // insert; conflictFields target the composite UNIQUE index (NULLS NOT
      // DISTINCT) so Postgres resolves the conflict in a single statement.
      const [result] = await this.appealDecisionModel.upsert(
        { ...key, ...data },
        {
          transaction: options.transaction,
          conflictFields: [
            'case_id',
            'ruling_file_id',
            'party_role',
            'defendant_id',
            'civil_claimant_id',
          ],
        },
      )

      this.logger.debug(
        `Upserted appeal decision ${result.id} for ${party.partyRole} in case ${party.caseId}`,
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
