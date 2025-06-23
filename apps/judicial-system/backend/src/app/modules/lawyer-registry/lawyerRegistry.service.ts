import { Sequelize } from 'sequelize'

import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common'
import { InjectConnection, InjectModel } from '@nestjs/sequelize'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

import { Lawyer, LawyersService } from '@island.is/judicial-system/lawyers'

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

  private async clearLawyerRegistry() {
    try {
      await this.lawyerRegistryModel.destroy({
        where: {},
      })
    } catch (error) {
      this.logger.error('Error clearing lawyer registry', error)
      throw new InternalServerErrorException('Error clearing lawyer registry')
    }
  }

  private async getLawyerRegistry() {
    try {
      const lawyers = await this.lawyersService.getLawyers()

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

  private async populateLawyerRegistry(lawyers: Lawyer[]) {
    try {
      const formattedLawyers = lawyers.map((lawyer) => ({
        name: lawyer.Name,
        nationalId: lawyer.SSN,
        email: lawyer.Email,
        phoneNumber: lawyer.Phone,
        practice: lawyer.Practice,
      }))

      await this.lawyerRegistryModel.bulkCreate(formattedLawyers)
    } catch (error) {
      this.logger.error('Error populating lawyer registry', error)
      throw new InternalServerErrorException('Error populating lawyer registry')
    }
  }

  async populate() {
    await this.clearLawyerRegistry()
    const lawyers = await this.getLawyerRegistry()
    await this.populateLawyerRegistry(lawyers)

    return lawyers
  }
}
