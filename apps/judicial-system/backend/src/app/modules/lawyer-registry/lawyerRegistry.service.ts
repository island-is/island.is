import { plainToClass } from 'class-transformer'
import { validate } from 'class-validator'
import type { Transaction, WhereOptions } from 'sequelize'
import { Sequelize } from 'sequelize'

import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common'
import { ConfigType } from '@nestjs/config'
import { InjectConnection, InjectModel } from '@nestjs/sequelize'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

import { LawyerFull, LawyerType } from '@island.is/judicial-system/types'

import { lawyerRegistryConfig } from './lawyerRegistry.config'
import { LawyerRegistry } from './lawyerRegistry.model'

type Lawyer = {
  name: string
  nationalId: string
  email: string
  phoneNumber: string
  practice: string
  isLitigator: boolean
}

@Injectable()
export class LawyerRegistryService {
  constructor(
    @Inject(lawyerRegistryConfig.KEY)
    private readonly config: ConfigType<typeof lawyerRegistryConfig>,
    @InjectConnection() private readonly sequelize: Sequelize,
    @InjectModel(LawyerRegistry)
    private readonly lawyerRegistryModel: typeof LawyerRegistry,
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

  async getLawyersFromLFMI(lawyerType?: LawyerType): Promise<LawyerFull[]> {
    const response = await fetch(
      `${this.config.lawyerRegistryAPI}/lawyers${
        lawyerType && lawyerType === LawyerType.LITIGATORS ? '?verjendur=1' : ''
      }`,
      {
        headers: {
          Authorization: `Basic ${this.config.lawyerRegistryAPIKey}`,
          Accept: 'application/json',
        },
      },
    )

    if (response.ok) {
      return response.json()
    }

    const reason = await response.text()
    this.logger.info('Failed to get lawyers from lawyer registry:', reason)
    throw new Error(reason)
  }

  private async getLawyerRegistry(lawyerType?: LawyerType) {
    try {
      const lawyers = await this.getLawyersFromLFMI(lawyerType)

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

  async getAll(lawyerType: LawyerType) {
    try {
      const whereOptions: WhereOptions | undefined =
        lawyerType === LawyerType.LITIGATORS
          ? {
              isLitigator: true,
            }
          : undefined

      const lawyers = await this.lawyerRegistryModel.findAll({
        where: whereOptions,
      })

      return lawyers
    } catch (error) {
      this.logger.error('Error getting all lawyers from lawyer registry', error)

      throw new InternalServerErrorException(
        'Error getting all lawyers from lawyer registry',
      )
    }
  }

  async getByNationalId(nationalId: string) {
    try {
      const lawyer = await this.lawyerRegistryModel.findOne({
        where: {
          nationalId,
        },
      })

      if (!lawyer) {
        throw new NotFoundException()
      }

      return lawyer
    } catch (error) {
      this.logger.error(
        `Error getting lawyer with national id ${nationalId}`,
        error,
      )

      throw new InternalServerErrorException(
        `Error getting lawyer with national id ${nationalId}`,
      )
    }
  }
}
