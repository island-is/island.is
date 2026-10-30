import { Transaction } from 'sequelize'

import { Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import { type Logger, LOGGER_PROVIDER } from '@island.is/logging'

import { RequestSharedWhen } from '@island.is/judicial-system/types'

import { Victim } from '../models/victim.model'

export type CreateVictim = {
  name?: string
  nationalId?: string
}

export type UpdateVictim = {
  name?: string
  hasNationalId?: boolean
  nationalId?: string
  hasLawyer?: boolean
  lawyerNationalId?: string
  lawyerName?: string
  lawyerEmail?: string
  lawyerPhoneNumber?: string
  lawyerAccessToRequest?: RequestSharedWhen
}

// Sequelize returns [affectedRows, rows] from update; naming the two halves keeps
// the tuple from leaking to callers.
export type UpdatedVictims = {
  numberOfAffectedRows: number
  victims: Victim[]
}

// Every caller runs under the request's transaction - the victim routes lock
// the case row before they read or change its victims - so the transaction is
// required rather than optional: a caller that forgets it is a type error,
// not a silent autocommit on a second pooled connection.
@Injectable()
export class VictimRepositoryService {
  constructor(
    @InjectModel(Victim) private readonly victimModel: typeof Victim,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  async findById(
    victimId: string,
    options: { transaction: Transaction },
  ): Promise<Victim | null> {
    try {
      this.logger.debug(`Finding victim ${victimId}`)

      return await this.victimModel.findByPk(victimId, options)
    } catch (error) {
      this.logger.error(`Error finding victim ${victimId}:`, { error })

      throw error
    }
  }

  async create(
    caseId: string,
    victim: CreateVictim,
    options: { transaction: Transaction },
  ): Promise<Victim> {
    try {
      this.logger.debug(`Creating a victim for case ${caseId}`)

      return await this.victimModel.create({ ...victim, caseId }, options)
    } catch (error) {
      this.logger.error(`Error creating a victim for case ${caseId}:`, {
        error,
      })

      throw error
    }
  }

  // A victim is only addressable within its own case, so both keys are named
  // parameters rather than a caller-supplied where clause.
  async updateByIdAndCase(
    victimId: string,
    caseId: string,
    update: UpdateVictim,
    options: { transaction: Transaction },
  ): Promise<UpdatedVictims> {
    try {
      this.logger.debug(`Updating victim ${victimId} of case ${caseId}`)

      const [numberOfAffectedRows, victims] = await this.victimModel.update(
        update,
        { where: { id: victimId, caseId }, returning: true, ...options },
      )

      return { numberOfAffectedRows, victims }
    } catch (error) {
      this.logger.error(
        `Error updating victim ${victimId} of case ${caseId}:`,
        {
          error,
        },
      )

      throw error
    }
  }

  async deleteByIdAndCase(
    victimId: string,
    caseId: string,
    options: { transaction: Transaction },
  ): Promise<number> {
    try {
      this.logger.debug(`Deleting victim ${victimId} of case ${caseId}`)

      return await this.victimModel.destroy({
        where: { id: victimId, caseId },
        ...options,
      })
    } catch (error) {
      this.logger.error(
        `Error deleting victim ${victimId} of case ${caseId}:`,
        {
          error,
        },
      )

      throw error
    }
  }
}
