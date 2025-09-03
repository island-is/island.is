import { CreateOptions, Transaction, UpdateOptions } from 'sequelize'

import { Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import { type Logger, LOGGER_PROVIDER } from '@island.is/logging'

import { CourtSession } from '../models/courtSession.model'

interface CreateCourtSessionOptions {
  transaction?: Transaction
}

interface UpdateCourtSessionOptions {
  where: {
    id: string
    caseId: string
  }
  transaction?: Transaction
}

export interface UpdateCourtSession {
  location?: string
  startDate?: Date
  endDate?: Date
  isClosed?: boolean
  closedLegalProvisions?: string[]
  attendees?: string
  entries?: string
  rulingType?: string
  ruling?: string
  isAttestingWitness?: boolean
  attestingWitnessId?: string
  closingEntries?: string
}

@Injectable()
export class CourtSessionRepositoryService {
  constructor(
    @InjectModel(CourtSession)
    private readonly courtSessionModel: typeof CourtSession,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  async create(
    data: { caseId: string },
    options?: CreateCourtSessionOptions,
  ): Promise<CourtSession> {
    try {
      this.logger.debug('Creating court session with data:', {
        data: Object.keys(data ?? {}),
      })

      const createOptions: CreateOptions = {}

      if (options?.transaction) {
        createOptions.transaction = options.transaction
      }

      const courtSession = await this.courtSessionModel.create(
        data,
        createOptions,
      )

      this.logger.debug(`Court session created with ID: ${courtSession.id}`)

      return courtSession
    } catch (error) {
      this.logger.error('Error creating court session with data:', {
        data: Object.keys(data ?? {}),
        error,
      })

      throw error
    }
  }

  async update(
    data: UpdateCourtSession,
    options: UpdateCourtSessionOptions,
  ): Promise<[affectedCount: number]> {
    try {
      this.logger.debug('Updating court session with data and conditions:', {
        data: Object.keys(data ?? {}),
        where: Object.keys(options?.where ?? {}),
      })

      const updateOptions: UpdateOptions = {
        where: options.where,
      }

      if (options.transaction) {
        updateOptions.transaction = options.transaction
      }

      const result = await this.courtSessionModel.update(data, updateOptions)

      this.logger.debug(`Updated ${result[0]} court session(s)`)

      return result
    } catch (error) {
      this.logger.error(
        'Error updating court session with data and conditions:',
        {
          data: Object.keys(data ?? {}),
          where: Object.keys(options?.where ?? {}),
          error,
        },
      )

      throw error
    }
  }
}
