import { Sequelize } from 'sequelize'

import { Inject, Injectable } from '@nestjs/common'
import { InjectConnection, InjectModel } from '@nestjs/sequelize'

import { LOGGER_PROVIDER } from '@island.is/logging'

import { LawyersService } from '@island.is/judicial-system/lawyers'

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

  private async getLawyerRegistry() {
    const lawyers = await this.lawyersService.getLawyers()

    return lawyers
  }

  private async populateLawyerRegistry() {
    const lawyers = await this.getLawyerRegistry()

    return lawyers
  }

  async populate() {
    const lawyers = await this.populateLawyerRegistry()

    for (const lawyer of lawyers) {
      await this.lawyerRegistryModel.create({
        name: lawyer.Name,
        nationalId: lawyer.SSN,
        email: lawyer.Email,
        phoneNumber: lawyer.Phone,
        practice: lawyer.Practice,
      })
    }

    return lawyers
  }
}
