import { Op, Transaction, UniqueConstraintError } from 'sequelize'

import {
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import { type Logger, LOGGER_PROVIDER } from '@island.is/logging'

import {
  AppealSummonsAppellantSide,
  HashAlgorithm,
  VerdictServiceStatus,
} from '@island.is/judicial-system/types'

import { AppealSummons } from '../models/appealSummons.model'
import { AppealSummonsDefendant } from '../models/appealSummonsDefendant.model'
import { AppealSummonsServiceRecipient } from '../models/appealSummonsServiceRecipient.model'
import { Institution } from '../models/institution.model'
import { User } from '../models/user.model'

export type CreateAppealSummons = {
  caseId: string
  appealCaseId: string
}

export type CreateAppealSummonsDefendant = {
  appealSummonsId: string
  defendantId: string
  appellantSide: AppealSummonsAppellantSide
  claims: string
}

// The send date is not here: it is written by markSentToCourtOfAppeals only,
// so that a send can never bypass its preconditions.
export type UpdateAppealSummons = {
  confirmedById?: string | null
  confirmedDate?: Date | null
  hash?: string | null
  hashAlgorithm?: HashAlgorithm | null
}

interface MarkSentToCourtOfAppealsOptions {
  transaction: Transaction
  // The confirmation the caller acted on. A concurrent edit that cleared it,
  // or a re-confirmation that moved it, makes the send a conflict.
  expectedConfirmedDate: Date | null
}

export type CreateAppealSummonsServiceRecipient = {
  appealSummonsId: string
  defendantId?: string
  civilClaimantId?: string
  sentToServiceDate: Date
}

export type UpdateAppealSummonsServiceRecipient = {
  externalPoliceDocumentId?: string
  serviceStatus?: VerdictServiceStatus | null
  serviceDate?: Date | null
  servedBy?: string | null
  comment?: string | null
}

export type RecordAppealSummonsServiceStatus = Omit<
  UpdateAppealSummonsServiceRecipient,
  'externalPoliceDocumentId'
>

@Injectable()
export class AppealSummonsRepositoryService {
  constructor(
    @InjectModel(AppealSummons)
    private readonly appealSummonsModel: typeof AppealSummons,
    @InjectModel(AppealSummonsDefendant)
    private readonly appealSummonsDefendantModel: typeof AppealSummonsDefendant,
    @InjectModel(AppealSummonsServiceRecipient)
    private readonly appealSummonsServiceRecipientModel: typeof AppealSummonsServiceRecipient,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  async create(
    data: CreateAppealSummons,
    options: { transaction: Transaction },
  ): Promise<AppealSummons> {
    try {
      this.logger.debug(
        `Creating an appeal summons for case ${data.caseId} and appeal case ${data.appealCaseId}`,
      )

      const result = await this.appealSummonsModel.create(data, {
        transaction: options.transaction,
      })

      this.logger.debug(`Created appeal summons ${result.id}`)

      return result
    } catch (error) {
      this.logger.error(
        `Error creating an appeal summons for case ${data.caseId}:`,
        { error },
      )

      throw error
    }
  }

  async findByIdAndCaseId(
    id: string,
    caseId: string,
    options?: { transaction?: Transaction },
  ): Promise<AppealSummons | null> {
    try {
      this.logger.debug(`Finding appeal summons ${id} for case ${caseId}`)

      const result = await this.appealSummonsModel.findOne({
        where: { id, caseId },
        include: [
          {
            model: User,
            as: 'confirmedBy',
            include: [{ model: Institution, as: 'institution' }],
          },
          {
            model: AppealSummonsDefendant,
            as: 'defendants',
            required: false,
            separate: true,
            order: [['created', 'ASC']],
          },
          {
            model: AppealSummonsServiceRecipient,
            as: 'services',
            required: false,
            separate: true,
            order: [['created', 'ASC']],
          },
        ],
        transaction: options?.transaction,
      })

      this.logger.debug(
        result
          ? `Found appeal summons ${id}`
          : `Appeal summons ${id} not found for case ${caseId}`,
      )

      return result
    } catch (error) {
      this.logger.error(
        `Error finding appeal summons ${id} for case ${caseId}:`,
        { error },
      )

      throw error
    }
  }

  /**
   * The summonses of a verdict appeal that have been confirmed, and so
   * issued, oldest first. Each carries its defendant rows, which say who it
   * was issued against.
   */
  async findConfirmedByAppealCaseId(
    appealCaseId: string,
    options?: { transaction?: Transaction },
  ): Promise<AppealSummons[]> {
    try {
      this.logger.debug(
        `Finding confirmed appeal summonses for appeal case ${appealCaseId}`,
      )

      const result = await this.appealSummonsModel.findAll({
        where: { appealCaseId, confirmedDate: { [Op.ne]: null } },
        include: [
          {
            model: AppealSummonsDefendant,
            as: 'defendants',
            required: false,
            separate: true,
            order: [['created', 'ASC']],
          },
        ],
        order: [['confirmedDate', 'ASC']],
        transaction: options?.transaction,
      })

      this.logger.debug(
        `Found ${result.length} confirmed appeal summonses for appeal case ${appealCaseId}`,
      )

      return result
    } catch (error) {
      this.logger.error(
        `Error finding confirmed appeal summonses for appeal case ${appealCaseId}:`,
        { error },
      )

      throw error
    }
  }

  async createDefendant(
    data: CreateAppealSummonsDefendant,
    options: { transaction: Transaction },
  ): Promise<AppealSummonsDefendant> {
    try {
      this.logger.debug(
        `Creating an appeal summons defendant row for summons ${data.appealSummonsId}`,
      )

      const result = await this.appealSummonsDefendantModel.create(data, {
        transaction: options.transaction,
      })

      this.logger.debug(
        `Created appeal summons defendant row ${result.id} for summons ${data.appealSummonsId}`,
      )

      return result
    } catch (error) {
      this.logger.error(
        `Error creating an appeal summons defendant row for summons ${data.appealSummonsId}:`,
        { error },
      )

      throw error
    }
  }

  // Every summons write reloads the row it changed, so the caller sees the
  // summons as it now stands, with its defendant and service rows.
  private async reloadUpdated(
    id: string,
    caseId: string,
    options: { transaction: Transaction },
  ): Promise<AppealSummons> {
    const updated = await this.findByIdAndCaseId(id, caseId, options)

    if (!updated) {
      throw new InternalServerErrorException(
        `Appeal summons ${id} of case ${caseId} was not found after update`,
      )
    }

    this.logger.debug(`Updated appeal summons ${id}`)

    return updated
  }

  async update(
    id: string,
    caseId: string,
    data: UpdateAppealSummons,
    options: { transaction: Transaction },
  ): Promise<AppealSummons> {
    try {
      this.logger.debug(`Updating appeal summons ${id} of case ${caseId}`)

      const [numberOfAffectedRows] = await this.appealSummonsModel.update(
        data,
        {
          where: { id, caseId },
          transaction: options.transaction,
        },
      )

      if (numberOfAffectedRows < 1) {
        throw new InternalServerErrorException(
          `Could not update appeal summons ${id} of case ${caseId}`,
        )
      }

      return await this.reloadUpdated(id, caseId, options)
    } catch (error) {
      this.logger.error(
        `Error updating appeal summons ${id} of case ${caseId}:`,
        { error },
      )

      throw error
    }
  }

  /**
   * Clears the confirmation of a summons so it can be edited, but only while
   * it has not been sent to the court of appeals. A send that went through
   * concurrently wins, and the edit is rejected with a ConflictException
   * before any of its side effects run.
   */
  async clearConfirmationIfUnsent(
    id: string,
    caseId: string,
    options: { transaction: Transaction },
  ): Promise<AppealSummons> {
    try {
      this.logger.debug(
        `Clearing the confirmation of appeal summons ${id} of case ${caseId}`,
      )

      const [numberOfAffectedRows] = await this.appealSummonsModel.update(
        {
          confirmedById: null,
          confirmedDate: null,
          hash: null,
          hashAlgorithm: null,
        },
        {
          where: { id, caseId, sentToCourtOfAppealsDate: null },
          transaction: options.transaction,
        },
      )

      if (numberOfAffectedRows < 1) {
        throw new ConflictException(
          `Could not update appeal summons ${id} of case ${caseId}`,
        )
      }

      return await this.reloadUpdated(id, caseId, options)
    } catch (error) {
      this.logger.error(
        `Error clearing the confirmation of appeal summons ${id} of case ${caseId}:`,
        { error },
      )

      throw error
    }
  }

  /**
   * Marks a confirmed summons as sent to the court of appeals. Two
   * preconditions guard the send against concurrent requests: the summons
   * must not have been sent already, and its confirmation must still be the
   * one the caller saw. A miss on either is a ConflictException, raised
   * before the event log and the notification.
   */
  async markSentToCourtOfAppeals(
    id: string,
    caseId: string,
    sentToCourtOfAppealsDate: Date,
    options: MarkSentToCourtOfAppealsOptions,
  ): Promise<AppealSummons> {
    try {
      this.logger.debug(
        `Marking appeal summons ${id} of case ${caseId} as sent to the court of appeals`,
      )

      const [numberOfAffectedRows] = await this.appealSummonsModel.update(
        { sentToCourtOfAppealsDate },
        {
          where: {
            id,
            caseId,
            sentToCourtOfAppealsDate: null,
            confirmedDate: options.expectedConfirmedDate,
          },
          transaction: options.transaction,
        },
      )

      if (numberOfAffectedRows < 1) {
        throw new ConflictException(
          `Could not update appeal summons ${id} of case ${caseId}`,
        )
      }

      return await this.reloadUpdated(id, caseId, {
        transaction: options.transaction,
      })
    } catch (error) {
      this.logger.error(
        `Error marking appeal summons ${id} of case ${caseId} as sent to the court of appeals:`,
        { error },
      )

      throw error
    }
  }

  async createServiceRecipient(
    data: CreateAppealSummonsServiceRecipient,
    options: { transaction: Transaction },
  ): Promise<AppealSummonsServiceRecipient> {
    try {
      this.logger.debug(
        `Creating an appeal summons service recipient for summons ${data.appealSummonsId}`,
      )

      const result = await this.appealSummonsServiceRecipientModel.create(
        data,
        {
          transaction: options.transaction,
        },
      )

      this.logger.debug(
        `Created appeal summons service recipient ${result.id} for summons ${data.appealSummonsId}`,
      )

      return result
    } catch (error) {
      if (error instanceof UniqueConstraintError) {
        throw new ConflictException(
          `Appeal summons service recipient already exists for summons ${data.appealSummonsId}`,
        )
      }

      this.logger.error(
        `Error creating an appeal summons service recipient for summons ${data.appealSummonsId}:`,
        { error },
      )

      throw error
    }
  }

  async findServiceRecipientById(
    id: string,
    appealSummonsId: string,
    options?: { transaction?: Transaction },
  ): Promise<AppealSummonsServiceRecipient | null> {
    try {
      return await this.appealSummonsServiceRecipientModel.findOne({
        where: { id, appealSummonsId },
        transaction: options?.transaction,
      })
    } catch (error) {
      this.logger.error(
        `Error finding appeal summons service recipient ${id} for summons ${appealSummonsId}:`,
        { error },
      )

      throw error
    }
  }

  /**
   * Reads a service recipient row under a FOR UPDATE lock that is held until
   * the transaction ends. Delivery to the police takes it so that concurrent
   * deliveries of the same row serialize and only one CreateDocument runs -
   * which also means the lock is held across that external call, so keep the
   * work between this read and the commit short.
   */
  async findServiceRecipientByIdForUpdate(
    id: string,
    appealSummonsId: string,
    options: { transaction: Transaction },
  ): Promise<AppealSummonsServiceRecipient | null> {
    try {
      this.logger.debug(
        `Locking appeal summons service recipient ${id} for summons ${appealSummonsId}`,
      )

      return await this.appealSummonsServiceRecipientModel.findOne({
        where: { id, appealSummonsId },
        transaction: options.transaction,
        lock: Transaction.LOCK.UPDATE,
      })
    } catch (error) {
      this.logger.error(
        `Error locking appeal summons service recipient ${id} for summons ${appealSummonsId}:`,
        { error },
      )

      throw error
    }
  }

  async findServiceRecipientByExternalPoliceDocumentId(
    externalPoliceDocumentId: string,
  ): Promise<AppealSummonsServiceRecipient | null> {
    try {
      this.logger.debug(
        `Finding appeal summons service recipient with police document id ${externalPoliceDocumentId}`,
      )

      return await this.appealSummonsServiceRecipientModel.findOne({
        where: { externalPoliceDocumentId },
        include: [{ model: AppealSummons, as: 'appealSummons' }],
      })
    } catch (error) {
      this.logger.error(
        `Error finding appeal summons service recipient with police document id ${externalPoliceDocumentId}:`,
        { error },
      )

      throw error
    }
  }

  private async reloadUpdatedServiceRecipient(
    id: string,
    appealSummonsId: string,
    options: { transaction: Transaction },
  ): Promise<AppealSummonsServiceRecipient> {
    const updated = await this.findServiceRecipientById(id, appealSummonsId, {
      transaction: options.transaction,
    })

    if (!updated) {
      throw new InternalServerErrorException(
        `Appeal summons service recipient ${id} of summons ${appealSummonsId} was not found after update`,
      )
    }

    return updated
  }

  async updateServiceRecipient(
    id: string,
    appealSummonsId: string,
    data: UpdateAppealSummonsServiceRecipient,
    options: { transaction: Transaction },
  ): Promise<AppealSummonsServiceRecipient> {
    try {
      this.logger.debug(
        `Updating appeal summons service recipient ${id} of summons ${appealSummonsId}`,
      )

      const [numberOfAffectedRows] =
        await this.appealSummonsServiceRecipientModel.update(data, {
          where: { id, appealSummonsId },
          transaction: options.transaction,
        })

      if (numberOfAffectedRows < 1) {
        throw new InternalServerErrorException(
          `Could not update appeal summons service recipient ${id} of summons ${appealSummonsId}`,
        )
      }

      return await this.reloadUpdatedServiceRecipient(
        id,
        appealSummonsId,
        options,
      )
    } catch (error) {
      this.logger.error(
        `Error updating appeal summons service recipient ${id} of summons ${appealSummonsId}:`,
        { error },
      )

      throw error
    }
  }

  /**
   * Records the service status a poll of the police returned, but only while
   * the row has none yet. A police push that landed during the poll owns the
   * row and must not be overwritten; the row is then left alone and null is
   * returned, so the caller can skip it.
   */
  async recordServiceStatusIfUnset(
    id: string,
    appealSummonsId: string,
    data: RecordAppealSummonsServiceStatus,
    options: { transaction: Transaction },
  ): Promise<AppealSummonsServiceRecipient | null> {
    try {
      this.logger.debug(
        `Recording the service status of appeal summons service recipient ${id} of summons ${appealSummonsId}`,
      )

      const [numberOfAffectedRows] =
        await this.appealSummonsServiceRecipientModel.update(data, {
          where: { id, appealSummonsId, serviceStatus: null },
          transaction: options.transaction,
        })

      if (numberOfAffectedRows < 1) {
        this.logger.debug(
          `Appeal summons service recipient ${id} of summons ${appealSummonsId} already has a service status`,
        )

        return null
      }

      return await this.reloadUpdatedServiceRecipient(
        id,
        appealSummonsId,
        options,
      )
    } catch (error) {
      this.logger.error(
        `Error recording the service status of appeal summons service recipient ${id} of summons ${appealSummonsId}:`,
        { error },
      )

      throw error
    }
  }

  async deleteDefendants(
    appealSummonsId: string,
    options: { transaction: Transaction },
  ): Promise<number> {
    try {
      this.logger.debug(
        `Deleting appeal summons defendant rows for summons ${appealSummonsId}`,
      )

      const numberOfDeletedRows =
        await this.appealSummonsDefendantModel.destroy({
          where: { appealSummonsId },
          transaction: options.transaction,
        })

      this.logger.debug(
        `Deleted ${numberOfDeletedRows} appeal summons defendant row(s) for summons ${appealSummonsId}`,
      )

      return numberOfDeletedRows
    } catch (error) {
      this.logger.error(
        `Error deleting appeal summons defendant rows for summons ${appealSummonsId}:`,
        { error },
      )

      throw error
    }
  }

  /**
   * Deletes a summons and its defendant rows, but only while it has not been
   * sent to the court of appeals. A send that went through concurrently wins
   * and the delete is rejected with a ConflictException; the defendant rows
   * already removed come back when the caller's transaction rolls back.
   */
  async deleteIfUnsent(
    id: string,
    caseId: string,
    options: { transaction: Transaction },
  ): Promise<boolean> {
    try {
      this.logger.debug(`Deleting appeal summons ${id} of case ${caseId}`)

      await this.deleteDefendants(id, options)

      const numberOfDeletedRows = await this.appealSummonsModel.destroy({
        where: { id, caseId, sentToCourtOfAppealsDate: null },
        transaction: options.transaction,
      })

      if (numberOfDeletedRows < 1) {
        throw new ConflictException(
          `Could not delete appeal summons ${id} of case ${caseId}`,
        )
      }

      this.logger.debug(`Deleted appeal summons ${id}`)

      return true
    } catch (error) {
      this.logger.error(
        `Error deleting appeal summons ${id} of case ${caseId}:`,
        { error },
      )

      throw error
    }
  }
}
