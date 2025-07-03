import { plainToClass } from 'class-transformer'
import { validate } from 'class-validator'
import type { Transaction } from 'sequelize'
import { Sequelize } from 'sequelize'

import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common'
import { InjectConnection, InjectModel } from '@nestjs/sequelize'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

import {
  Lawyer,
  LawyersService,
  LawyerType,
} from '@island.is/judicial-system/lawyers'

import { LawyerRegistry } from './lawyerRegistry.model'

@Injectable()
export class LawyerRegistryService {
  constructor(
    @InjectConnection() private readonly sequelize: Sequelize,
    @InjectModel(LawyerRegistry)
    private readonly lawyerRegistryModel: typeof LawyerRegistry,
    private readonly lawyersService: LawyersService,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  private async clearLawyerRegistry(transaction: Transaction) {
    try {
      await this.lawyerRegistryModel.destroy({
        where: {},
        transaction,
      })
    } catch (error) {
      this.logger.error('Error clearing lawyer registry', error)
      throw new InternalServerErrorException('Error clearing lawyer registry')
    }
  }

  private async getLawyerRegistry(lawyerType?: LawyerType) {
    try {
      const lawyers = await this.lawyersService.getLawyers(lawyerType)

      if (lawyers.length === 0) {
        throw new InternalServerErrorException(
          'No lawyers found in the registry',
        )
      }

      return lawyers
    } catch (error) {
      throw new InternalServerErrorException('Error fetching lawyer registry')
    }
  }

  private async populateLawyerRegistry(
    lawyers: Lawyer[],
    transaction: Transaction,
  ) {
    try {
      for (const lawyer of lawyers) {
        const lawyerInstance = plainToClass(LawyerRegistry, lawyer)
        const errors = await validate(lawyerInstance)

        if (errors.length > 0) {
          throw new Error(
            `Validation failed for lawyer: ${JSON.stringify(errors)}`,
          )
        }
      }

      await this.lawyerRegistryModel.bulkCreate(lawyers, {
        transaction,
      })
    } catch (error) {
      this.logger.error('Error populating lawyer registry', error)
      throw new InternalServerErrorException('Error populating lawyer registry')
    }
  }

  async populate() {
    const transaction = await this.sequelize.transaction()

    try {
      const lawyers = await this.getLawyerRegistry()
      const litigators = await this.getLawyerRegistry(LawyerType.LITIGATORS)
      const litigatorNationalIds = new Set(litigators.map((l) => l.SSN))

      const formattedLawyers: Lawyer[] = lawyers.map((lawyer) => ({
        name: lawyer.Name,
        nationalId: lawyer.SSN,
        email: lawyer.Email,
        phoneNumber: lawyer.Phone,
        practice: lawyer.Practice,
        isLitigator: litigatorNationalIds.has(lawyer.SSN),
      }))

      await this.clearLawyerRegistry(transaction)
      await this.populateLawyerRegistry(formattedLawyers, transaction)
      await transaction.commit()

      return lawyers
    } catch (error) {
      await transaction.rollback()
      this.logger.error('Error populating lawyer registry', error)

      throw new InternalServerErrorException('Error populating lawyer registry')
    }
  }
}
