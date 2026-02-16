import { Transaction, UpdateOptions } from 'sequelize'

import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import { type Logger, LOGGER_PROVIDER } from '@island.is/logging'

import { formatDate } from '@island.is/judicial-system/formatters'
import {
  CourtSessionRulingType,
  CourtSessionStringType,
  EventType,
} from '@island.is/judicial-system/types'

import { Case } from '../models/case.model'
import { CourtSession } from '../models/courtSession.model'
import { CourtSessionString } from '../models/courtSessionString.model'
import { EventLog } from '../models/eventLog.model'
import { CourtDocumentRepositoryService } from './courtDocumentRepository.service'

interface CreateCourtSessionOptions {
  transaction: Transaction
}

interface UpdateCourtSessionOptions {
  transaction: Transaction
}

interface DeleteCourtSessionOptions {
  transaction: Transaction
}

interface UpdateCourtSession {
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
  isAttestingWitness?: boolean
  attestingWitnessId?: string
  closingEntries?: string
  isConfirmed?: boolean
}

@Injectable()
export class CourtSessionRepositoryService {
  constructor(
    @InjectModel(EventLog) private readonly eventLogModel: typeof EventLog,
    @InjectModel(Case) private readonly caseModel: typeof Case,
    @InjectModel(CourtSessionString)
    private readonly courtSessionStringModel: typeof CourtSessionString,
    @InjectModel(CourtSession)
    private readonly courtSessionModel: typeof CourtSession,
    private readonly courtDocumentRepositoryService: CourtDocumentRepositoryService,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

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

      const transaction = options.transaction

      await this.courtDocumentRepositoryService.fileAllAvailableCourtDocumentsInCourtSession(
        caseId,
        courtSession.id,
        { transaction },
      )

      // File all unfiled merged documents
      const mergedCases = await this.caseModel.findAll({
        where: { mergeCaseId: caseId },
        order: [['created', 'ASC']],
        transaction,
      })

      for (const mergedCase of mergedCases) {
        await this.addMergedCaseToCourtSession(
          caseId,
          courtSession.id,
          mergedCase,
          transaction,
        )
      }

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

  async addMergedCaseToLatestCourtSession(
    caseId: string,
    mergedCaseId: string,
    options: UpdateCourtSessionOptions,
  ) {
    try {
      this.logger.debug(
        `Adding merged case ${mergedCaseId} to latest court session of case ${caseId}`,
      )

      const transaction = options.transaction

      const latestCourtSession = await this.courtSessionModel.findOne({
        where: { caseId },
        order: [['created', 'DESC']],
        transaction,
      })

      if (!latestCourtSession || latestCourtSession.isConfirmed) {
        throw new InternalServerErrorException(
          `The latest court session of case ${caseId} must not be confirmed when adding merged case ${mergedCaseId}`,
        )
      }

      const mergedCase = await this.caseModel.findByPk(mergedCaseId, {
        transaction,
      })

      if (!mergedCase) {
        throw new InternalServerErrorException(
          `Could not find case ${mergedCaseId} when adding it as a merged case to the latest court session of case ${caseId}`,
        )
      }

      await this.addMergedCaseToCourtSession(
        caseId,
        latestCourtSession.id,
        mergedCase,
        transaction,
      )

      return latestCourtSession
    } catch (error) {
      this.logger.error(
        `Error adding merged case ${mergedCaseId} to latest court session of case ${caseId}`,
        { error },
      )

      throw error
    }
  }

  private async addMergedCaseToCourtSession(
    caseId: string,
    courtSessionId: string,
    mergedCase: Case,
    transaction: Transaction,
  ) {
    const added =
      await this.courtDocumentRepositoryService.updateMergedCourtDocuments({
        parentCaseId: caseId,
        parentCaseCourtSessionId: courtSessionId,
        caseId: mergedCase.id,
        transaction,
      })

    if (!added) {
      return
    }

    const event = await this.eventLogModel.findOne({
      where: {
        caseId: mergedCase.id,
        eventType: [
          EventType.CASE_SENT_TO_COURT,
          EventType.INDICTMENT_CONFIRMED,
        ],
      },
      order: [['created', 'DESC']],
      transaction,
    })

    await this.courtSessionStringModel.create(
      {
        caseId,
        courtSessionId,
        mergedCaseId: mergedCase.id,
        stringType: CourtSessionStringType.ENTRIES,
        value: `Mál nr. ${
          mergedCase.courtCaseNumber
        } sem var höfðað á hendur ákærða${
          event
            ? ` með ákæru útgefinni ${formatDate(event.created, 'PPP')}`
            : ''
        }, er nú einnig tekið fyrir og það sameinað þessu máli, sbr. heimild í 1. mgr. 169. gr. laga nr. 88/2008 um meðferð sakamála, og verða þau eftirleiðis rekin undir málsnúmeri þessa máls.`,
      },
      { transaction },
    )
  }

  async delete(
    caseId: string,
    courtSessionId: string,
    options: DeleteCourtSessionOptions,
  ): Promise<void> {
    try {
      this.logger.debug(
        `Deleting court session ${courtSessionId} of case ${caseId}`,
      )

      const transaction = options.transaction

      // First delete all documents in the session
      await this.courtDocumentRepositoryService.deleteDocumentsInSession(
        caseId,
        courtSessionId,
        transaction,
      )

      // Then delete the session itself
      await this.deleteFromDatabase(caseId, courtSessionId, transaction)

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

  private async deleteFromDatabase(
    caseId: string,
    courtSessionId: string,
    transaction: Transaction,
  ) {
    const numberOfDeletedRows = await this.courtSessionModel.destroy({
      where: { id: courtSessionId, caseId },
      transaction,
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
  }
}
