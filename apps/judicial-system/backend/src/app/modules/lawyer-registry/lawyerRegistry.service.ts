import { plainToClass } from 'class-transformer'
import { validate } from 'class-validator'
import type { Transaction } from 'sequelize'

import {
  BadGatewayException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { ConfigType } from '@nestjs/config'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

import { LawyerFull, LawyerType } from '@island.is/judicial-system/types'

import {
  LawyerRegistry,
  LawyerRegistryData,
  LawyerRegistryRepositoryService,
} from '../repository'
import { lawyerRegistryConfig } from './lawyerRegistry.config'

@Injectable()
export class LawyerRegistryService {
  constructor(
    @Inject(lawyerRegistryConfig.KEY)
    private readonly config: ConfigType<typeof lawyerRegistryConfig>,
    private readonly lawyerRegistryRepositoryService: LawyerRegistryRepositoryService,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

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
    this.logger.error('Failed to get lawyers from lawyer registry', { reason })

    throw new BadGatewayException(
      'Failed to get lawyers from lawyer registry',
      reason,
    )
  }

  private async getLawyerRegistry(lawyerType?: LawyerType) {
    const lawyers = await this.getLawyersFromLFMI(lawyerType)

    if (lawyers.length === 0) {
      this.logger.error('No lawyers found in the registry')

      throw new NotFoundException('No lawyers found in the registry')
    }

    return lawyers
  }

  private async validateLawyers(lawyers: LawyerRegistryData[]) {
    for (const lawyer of lawyers) {
      const lawyerInstance = plainToClass(LawyerRegistry, lawyer)
      const errors = await validate(lawyerInstance)

      if (errors.length > 0) {
        this.logger.error(`Validation failed for lawyer`, { errors })

        throw new BadGatewayException(
          `Validation failed for lawyer: ${JSON.stringify(errors)}`,
        )
      }
    }
  }

  async populate(transaction: Transaction) {
    const lawyers = await this.getLawyerRegistry()
    const litigators = await this.getLawyerRegistry(LawyerType.LITIGATORS)
    const litigatorNationalIds = new Set(litigators.map((l) => l.SSN))

    const formattedLawyers: LawyerRegistryData[] = lawyers.map((lawyer) => ({
      name: lawyer.Name,
      nationalId: lawyer.SSN,
      email: lawyer.Email,
      phoneNumber: lawyer.GSM ?? lawyer.Phone,
      practice: lawyer.Practice,
      isLitigator: litigatorNationalIds.has(lawyer.SSN),
    }))

    await this.validateLawyers(formattedLawyers)

    await this.lawyerRegistryRepositoryService.replaceAll(formattedLawyers, {
      transaction,
    })

    return lawyers
  }

  async getAll(lawyerType: LawyerType) {
    const lawyers =
      lawyerType === LawyerType.LITIGATORS
        ? await this.lawyerRegistryRepositoryService.findAllLitigators()
        : await this.lawyerRegistryRepositoryService.findAll()

    if (!lawyers || lawyers.length === 0) {
      this.logger.error('No lawyers found in the lawyer registry')

      throw new NotFoundException('No lawyers found in the lawyer registry')
    }

    return lawyers
  }

  async getByNationalId(nationalId: string) {
    const lawyer = await this.lawyerRegistryRepositoryService.findByNationalId(
      nationalId,
    )

    if (!lawyer) {
      throw new NotFoundException()
    }

    return lawyer
  }
}
