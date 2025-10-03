import { CreateOptions, Transaction, UpdateOptions } from 'sequelize'

import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import { type Logger, LOGGER_PROVIDER } from '@island.is/logging'

import { CourtSessionRulingType } from '@island.is/judicial-system/types'

import { CourtSession } from '../models/courtSession.model'

interface CreateCourtSessionOptions {
  transaction?: Transaction
}

interface UpdateCourtSessionOptions {
  transaction?: Transaction
}

interface UpdateCourtSession {
  location?: string
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
    @InjectModel(CourtSession)
    private readonly courtSessionModel: typeof CourtSession,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  async create(
    caseId: string,
    options?: CreateCourtSessionOptions,
  ): Promise<CourtSession> {
    try {
      this.logger.debug(`Creating a new court session for case ${caseId}`)

      const createOptions: CreateOptions = {}

      if (options?.transaction) {
        createOptions.transaction = options.transaction
      }

      const courtSession = await this.courtSessionModel.create(
        { caseId },
        createOptions,
      )

      this.logger.debug(
        `Created a new court session ${courtSession.id} for case ${caseId}`,
      )

      return courtSession
    } catch (error) {
      this.logger.error(`Error creating a new court session for case ${caseId}`)

      throw error
    }
  }

  async update(
    caseId: string,
    courtSessionId: string,
    data: UpdateCourtSession,
    options?: UpdateCourtSessionOptions,
  ): Promise<CourtSession> {
    try {
      this.logger.debug(
        `Updating court session ${courtSessionId} of case ${caseId} with data:`,
        { data: Object.keys(data) },
      )

      const updateOptions: UpdateOptions = {
        where: { id: courtSessionId, caseId },
      }

      if (options?.transaction) {
        updateOptions.transaction = options.transaction
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
}
