import { Injectable } from '@nestjs/common'
import { logger } from '@island.is/logging'
import { CmsRepository } from '../../../../platform/cms.repository'
import { syncCreateAndReconcile } from '../../../../platform/sync-strategies'
import { LOCALE } from '../../../../constants'
import { FSREBuildingsRepository } from './fsre-buildings.repository'
import { BuildingDto } from './dto/building.dto'
import {
  mapEntryCreationDto,
  mapEntryUpdateDto,
  mapSlug,
} from './fsre-buildings.mapper'
import { GENERIC_LIST_ID, REGION_TAGS } from './constants'

@Injectable()
export class FSREBuildingsImportService {
  constructor(
    private readonly cmsRepository: CmsRepository,
    private readonly clientsRepository: FSREBuildingsRepository,
  ) {}

  async run(): Promise<void> {
    const buildings = await this.clientsRepository.getBuildings()

    if (!buildings || !buildings.length) {
      logger.warn('No buildings to process')
      return
    }

    await syncCreateAndReconcile<BuildingDto>({
      cmsRepository: this.cmsRepository,
      genericListId: GENERIC_LIST_ID,
      logLabel: 'FSRE buildings import',
      getItems: async () => buildings,
      getCreateDedupeKey: (item) => mapSlug(item)[LOCALE],
      getExistingCreateKey: (entry) => entry.fields['slug']?.[LOCALE],
      mapCreateEntry: (item) =>
        mapEntryCreationDto(item, GENERIC_LIST_ID, REGION_TAGS),
      getUpdateMatchKey: (item) => `FSRE: ${item.address}_${item.id}`,
      getExistingUpdateKey: (entry) => entry.fields['internalTitle']?.[LOCALE],
      mapUpdateEntry: (existingEntry, item) =>
        mapEntryUpdateDto(existingEntry, item),
    })
  }
}
