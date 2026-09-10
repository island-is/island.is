import { Transaction, UpdateOptions } from 'sequelize'

import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import { type Logger, LOGGER_PROVIDER } from '@island.is/logging'

import { CourtSessionRulingType } from '@island.is/judicial-system/types'

import { CourtSession } from '../models/courtSession.model'

interface FindByIdOptions {
  transaction?: Transaction
  // Takes a row lock, so a concurrent transaction reading the same session
  // waits for this one to commit rather than acting on a stale copy.
  lock?: boolean
}

interface CreateCourtSessionOptions {
  transaction: Transaction
}

interface UpdateCourtSessionOptions {
  transaction: Transaction
}

interface DeleteCourtSessionOptions {
  transaction: Transaction
}

export interface UpdateCourtSession {
  location?: string
  judgeId?: string
  startDate?: Date
  endDate?: Date
  isClosed?: boolean
  closedLegalProvisions?: string[]
  attendees?: string
  entries?: string
  rulingType?: CourtSessionRulingType
  ruling?: string
  rulingFileId?: string | null
  isAttestingWitness?: boolean
  attestingWitnessId?: string
  closingEntries?: string
  isConfirmed?: boolean
  notifiedRulingFileId?: string
}

@Injectable()
export class CourtSessionRepositoryService {
  constructor(
    @InjectModel(CourtSession)
    private readonly courtSessionModel: typeof CourtSession,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  async findById(
    caseId: string,
    courtSessionId: string,
    options?: FindByIdOptions,
  ): Promise<CourtSession | null> {
    try {
      this.logger.debug(
        `Finding court session ${courtSessionId} of case ${caseId}`,
      )

      const result = await this.courtSessionModel.findOne({
        where: { id: courtSessionId, caseId },
        ...(options?.transaction ? { transaction: options.transaction } : {}),
        ...(options?.lock ? { lock: Transaction.LOCK.UPDATE } : {}),
      })

      this.logger.debug(
        `Court session ${courtSessionId} of case ${caseId} ${
          result ? 'found' : 'not found'
        }`,
      )

      return result
    } catch (error) {
      this.logger.error(
        `Error finding court session ${courtSessionId} of case ${caseId}:`,
        { error },
      )

      throw error
    }
  }

  // Which court sessions pronounce a given ruling, read from the caller's
  // transaction rather than from case associations loaded earlier - a caller
  // deciding whether a ruling is still spoken for must not act on a snapshot.
  async findAllByRulingFileId(
    caseId: string,
    rulingFileId: string,
    options?: { transaction?: Transaction },
  ): Promise<CourtSession[]> {
    try {
      this.logger.debug(
        `Finding court sessions of case ${caseId} pronouncing ruling ${rulingFileId}`,
      )

      const result = await this.courtSessionModel.findAll({
        where: { caseId, rulingFileId },
        ...(options?.transaction ? { transaction: options.transaction } : {}),
      })

      this.logger.debug(
        `Found ${result.length} court sessions of case ${caseId} pronouncing ruling ${rulingFileId}`,
      )

      return result
    } catch (error) {
      this.logger.error(
        `Error finding court sessions of case ${caseId} pronouncing ruling ${rulingFileId}:`,
        { error },
      )

      throw error
    }
  }

  // The latest court session of a case, read from the caller's transaction.
  // Whether it may still be added to or deleted is the caller's rule to apply.
  async findLatestByCase(
    caseId: string,
    options?: { transaction?: Transaction },
  ): Promise<CourtSession | null> {
    try {
      this.logger.debug(`Finding the latest court session of case ${caseId}`)

      const result = await this.courtSessionModel.findOne({
        where: { caseId },
        order: [['created', 'DESC']],
        ...(options?.transaction ? { transaction: options.transaction } : {}),
      })

      this.logger.debug(
        `Latest court session of case ${caseId} ${
          result ? 'found' : 'not found'
        }`,
      )

      return result
    } catch (error) {
      this.logger.error(
        `Error finding the latest court session of case ${caseId}:`,
        { error },
      )

      throw error
    }
  }

  // Creates the court session row only. Filing the case's court documents in
  // it and recording its merged cases is CourtSessionService's sequence.
  async create(
    caseId: string,
    options: CreateCourtSessionOptions,
  ): Promise<CourtSession> {
    try {
      this.logger.debug(`Creating a new court session for case ${caseId}`)

      const courtSession = await this.courtSessionModel.create(
        { caseId },
        options,
      )

      this.logger.debug(
        `Created a new court session ${courtSession.id} for case ${caseId}`,
      )

      return courtSession
    } catch (error) {
      this.logger.error(
        `Error creating a new court session for case ${caseId}`,
        { error },
      )

      throw error
    }
  }

  async update(
    caseId: string,
    courtSessionId: string,
    data: UpdateCourtSession,
    options: UpdateCourtSessionOptions,
  ): Promise<CourtSession> {
    try {
      this.logger.debug(
        `Updating court session ${courtSessionId} of case ${caseId} with data:`,
        { data: Object.keys(data) },
      )

      const updateOptions: UpdateOptions = {
        where: { id: courtSessionId, caseId },
        transaction: options.transaction,
      }

      const [numberOfAffectedRows, courtSessions] =
        await this.courtSessionModel.update(data, {
          ...updateOptions,
          returning: true,
        })

      if (numberOfAffectedRows < 1) {
        throw new InternalServerErrorException(
          `Could not update court session ${courtSessionId} of case ${caseId}`,
        )
      }

      if (numberOfAffectedRows > 1) {
        // Tolerate failure, but log error
        this.logger.error(
          `Unexpected number of rows (${numberOfAffectedRows}) affected when updating court session ${courtSessionId} of case ${caseId} with data:`,
          { data: Object.keys(data) },
        )
      }

      this.logger.debug(
        `Updated court session ${courtSessionId} of case ${caseId}`,
      )

      return courtSessions[0]
    } catch (error) {
      this.logger.error(
        `Error updating court session ${courtSessionId} of case ${caseId} with data:`,
        { data: Object.keys(data), error },
      )

      throw error
    }
  }

  // Deletes the court session row only. The caller has already emptied the
  // session - its court documents and strings - and checked it is the latest.
  async delete(
    caseId: string,
    courtSessionId: string,
    options: DeleteCourtSessionOptions,
  ): Promise<void> {
    try {
      this.logger.debug(
        `Deleting court session ${courtSessionId} of case ${caseId}`,
      )

      const numberOfDeletedRows = await this.courtSessionModel.destroy({
        where: { id: courtSessionId, caseId },
        transaction: options.transaction,
      })

      if (numberOfDeletedRows < 1) {
        throw new InternalServerErrorException(
          `Could not delete court session ${courtSessionId} of case ${caseId}`,
        )
      }

      if (numberOfDeletedRows > 1) {
        // Tolerate failure, but log error
        this.logger.error(
          `Unexpected number of rows (${numberOfDeletedRows}) affected when deleting court session ${courtSessionId} of case ${caseId}`,
        )
      }

      this.logger.debug(
        `Deleted court session ${courtSessionId} of case ${caseId}`,
      )
    } catch (error) {
      this.logger.error(
        `Error deleting court session ${courtSessionId} of case ${caseId}:`,
        { error },
      )

      throw error
    }
  }
}
