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

    this.logger.debug(
      `Replacing the lawyer registry with ${lawyers.length} lawyers`,
    )

    await this.lawyerRegistryModel.destroy({ where: {}, transaction })

    return this.lawyerRegistryModel.bulkCreate(lawyers, { transaction })
  }

  async findAll(): Promise<LawyerRegistry[]> {
    this.logger.debug('Finding all lawyers in the lawyer registry')

    return this.lawyerRegistryModel.findAll()
  }

  async findAllLitigators(): Promise<LawyerRegistry[]> {
    this.logger.debug('Finding all litigators in the lawyer registry')

    return this.lawyerRegistryModel.findAll({ where: { isLitigator: true } })
  }

  async findByNationalId(nationalId: string): Promise<LawyerRegistry | null> {
    this.logger.debug('Finding a lawyer in the lawyer registry by national id')

    return this.lawyerRegistryModel.findOne({ where: { nationalId } })
  }
}
