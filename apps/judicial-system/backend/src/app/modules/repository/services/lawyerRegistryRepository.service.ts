import type { Transaction } from 'sequelize'

import { Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import { type Logger, LOGGER_PROVIDER } from '@island.is/logging'

import { LawyerRegistry } from '../models/lawyerRegistry.model'

// A type alias rather than an interface on purpose: only type aliases get TypeScript's
// implicit index signature, which bulkCreate's parameter type requires.
export type LawyerRegistryData = {
  name: string
  nationalId: string
  email: string
  phoneNumber: string
  practice: string
  isLitigator: boolean
}

@Injectable()
export class LawyerRegistryRepositoryService {
  constructor(
    @InjectModel(LawyerRegistry)
    private readonly lawyerRegistryModel: typeof LawyerRegistry,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  async replaceAll(
    lawyers: LawyerRegistryData[],
    options: { transaction: Transaction },
  ): Promise<LawyerRegistry[]> {
    const { transaction } = options

    try {
      this.logger.debug(
        `Replacing the lawyer registry with ${lawyers.length} lawyers`,
      )

      const numberOfDeletedRows = await this.lawyerRegistryModel.destroy({
        where: {},
        transaction,
      })

      const createdLawyers = await this.lawyerRegistryModel.bulkCreate(
        lawyers,
        {
          transaction,
        },
      )

      this.logger.debug(
        `Replaced ${numberOfDeletedRows} lawyer(s) in the lawyer registry with ${createdLawyers.length}`,
      )

      return createdLawyers
    } catch (error) {
      this.logger.error(
        `Error replacing the lawyer registry with ${lawyers.length} lawyers:`,
        { error },
      )

      throw error
    }
  }

  async findAll(): Promise<LawyerRegistry[]> {
    try {
      this.logger.debug('Finding all lawyers in the lawyer registry')

      return await this.lawyerRegistryModel.findAll()
    } catch (error) {
      this.logger.error('Error finding all lawyers in the lawyer registry:', {
        error,
      })

      throw error
    }
  }

  async findAllLitigators(): Promise<LawyerRegistry[]> {
    try {
      this.logger.debug('Finding all litigators in the lawyer registry')

      return await this.lawyerRegistryModel.findAll({
        where: { isLitigator: true },
      })
    } catch (error) {
      this.logger.error(
        'Error finding all litigators in the lawyer registry:',
        { error },
      )

      throw error
    }
  }

  async findByNationalId(nationalId: string): Promise<LawyerRegistry | null> {
    try {
      this.logger.debug(
        'Finding a lawyer in the lawyer registry by national id',
      )

      return await this.lawyerRegistryModel.findOne({ where: { nationalId } })
    } catch (error) {
      this.logger.error(
        'Error finding a lawyer in the lawyer registry by national id:',
        { error },
      )

      throw error
    }
  }
}
