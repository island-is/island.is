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

@Injectable()
export class VictimRepositoryService {
  constructor(
    @InjectModel(Victim) private readonly victimModel: typeof Victim,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  async findById(victimId: string): Promise<Victim | null> {
    try {
      this.logger.debug(`Finding victim ${victimId}`)

      return await this.victimModel.findByPk(victimId)
    } catch (error) {
      this.logger.error(`Error finding victim ${victimId}:`, { error })

      throw error
    }
  }

  async create(caseId: string, victim: CreateVictim): Promise<Victim> {
    try {
      this.logger.debug(`Creating a victim for case ${caseId}`)

      return await this.victimModel.create({ ...victim, caseId })
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
  ): Promise<UpdatedVictims> {
    try {
      this.logger.debug(`Updating victim ${victimId} of case ${caseId}`)

      const [numberOfAffectedRows, victims] = await this.victimModel.update(
        update,
        { where: { id: victimId, caseId }, returning: true },
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

  async deleteByIdAndCase(victimId: string, caseId: string): Promise<number> {
    try {
      this.logger.debug(`Deleting victim ${victimId} of case ${caseId}`)

      return await this.victimModel.destroy({
        where: { id: victimId, caseId },
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

  // Copies every victim of a case to another case as a new row.
  async copyAllToCase(
    caseId: string,
    newCaseId: string,
    options: { transaction: Transaction },
  ): Promise<void> {
    try {
      this.logger.debug(
        `Copying all victims of case ${caseId} to case ${newCaseId}`,
      )

      const victims = await this.victimModel.findAll({
        where: { caseId },
        transaction: options.transaction,
      })

      await Promise.all(
        victims.map((victim) =>
          this.victimModel.create(
            { ...victim.toJSON(), id: undefined, caseId: newCaseId },
            { transaction: options.transaction },
          ),
        ),
      )

      this.logger.debug(
        `Copied ${victims.length} victims of case ${caseId} to case ${newCaseId}`,
      )
    } catch (error) {
      this.logger.error(
        `Error copying all victims of case ${caseId} to case ${newCaseId}:`,
        { error },
      )

      throw error
    }
  }
}
