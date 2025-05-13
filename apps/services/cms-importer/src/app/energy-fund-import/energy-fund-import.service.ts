import { Injectable } from '@nestjs/common'
import { CmsRepository } from '../repositories/cms/cms.repository'
import { logger } from '@island.is/logging'
import { EnergyGrantsRepository } from '../repositories/energyGrants/energyGrants.repository'

@Injectable()
export class EnergyFundImportService {
  constructor(
    private readonly cmsRepository: CmsRepository,
    private readonly clientsRepository: EnergyGrantsRepository,
  ) {}

  public async run() {
    logger.info('Energy fund import worker starting...')
    await this.processEnergyGrants()
    logger.info('...Energy fund import worker finished.')
  }

  private async processEnergyGrants() {
    const grants = await this.clientsRepository.getEnergyGrants(1)
    if (grants) {
      await this.cmsRepository.updatePreviousEnergyFundGrantRecipients(grants)
    }
  }
}
