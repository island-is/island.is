import { Injectable } from '@nestjs/common'
import { logger } from '@island.is/logging'
import { CmsRepository } from '../../../../platform/cms.repository'
import { syncCreateAndReconcile } from '../../../../platform/sync-strategies'
import { LOCALE } from '../../../../constants'
import { EnergyGrantsRepository } from './energy-fund.repository'
import { EnergyGrantDto } from './dto/energyGrant.dto'
import { mapEntryCreationDto, mapEntryUpdateDto } from './energy-fund.mapper'
import { PREVIOUS_RECIPIENTS_GENERIC_LIST_ID, UOS_TAGS } from './constants'

@Injectable()
export class EnergyFundImportService {
  constructor(
    private readonly cmsRepository: CmsRepository,
    private readonly clientsRepository: EnergyGrantsRepository,
  ) {}

  async run(): Promise<void> {
    const grants = await this.clientsRepository.getEnergyGrants()

    if (!grants) {
      logger.warn('No grants to process')
      return
    }

    await syncCreateAndReconcile<EnergyGrantDto>({
      cmsRepository: this.cmsRepository,
      genericListId: PREVIOUS_RECIPIENTS_GENERIC_LIST_ID,
      logLabel: 'Energy fund import',
      getItems: async () => grants.grants,
      getCreateDedupeKey: (item) => item.projectName,
      getExistingCreateKey: (entry) => entry.fields['internalTitle']?.[LOCALE],
      mapCreateEntry: (item) =>
        mapEntryCreationDto(item, PREVIOUS_RECIPIENTS_GENERIC_LIST_ID, UOS_TAGS),
      getUpdateMatchKey: (item) => item.projectName,
      getExistingUpdateKey: (entry) => entry.fields['internalTitle']?.[LOCALE],
      mapUpdateEntry: (existingEntry, item) =>
        mapEntryUpdateDto(existingEntry, item),
    })
  }
}
