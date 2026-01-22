import { Injectable } from '@nestjs/common'
import { CmsRepository } from '../repositories/cms/cms.repository'
import { logger } from '@island.is/logging'
import { EntryCreationDto } from '../repositories/cms/cms.types'
import { isDefined } from '@island.is/shared/utils'
import { LOCALE } from '../constants'
import { FSREBuildingsRepository } from '../repositories/fsre-buildings/fsreBuildings.repository'
import { GENERIC_LIST_ID, REGION_TAGS } from './constants'
import {
  mapEntryCreationDto,
  mapEntryUpdateDto,
} from '../repositories/fsre-buildings/mapper'
import { BuildingDto } from '../repositories/fsre-buildings/dto/building.dto'

@Injectable()
export class FSREBuildingsImportService {
  constructor(
    private readonly cmsRepository: CmsRepository,
    private readonly clientsRepository: FSREBuildingsRepository,
  ) {}

  public async run() {
    logger.info('FSRE buildings import worker starting...')
    await this.processFSREBuildings()
    logger.info('...FSRE buildings import worker finished.')
  }

  private async processFSREBuildings() {
    const buildings = await this.clientsRepository.getBuildings(10)

    if (!buildings || !buildings.length) {
      logger.warn('No buildings to process')
      return
    }

    //first we create the entries
    await this.createEntries(buildings)
    //then we update the entries
    await this.updateEntries(buildings)
  }

  private async createEntries(buildings: Array<BuildingDto>): Promise<void> {
    const existingEntries = await this.cmsRepository.getGenericListItemEntries(
      GENERIC_LIST_ID,
    )

    const previousEntryNames: Array<string> = existingEntries
      .map((i) => {
        const title: string = i.fields['internalTitle']?.[LOCALE]
        if (!title) {
          return null
        }
        return title
      })
      .filter(isDefined)

    const newEntries: Array<EntryCreationDto> = buildings
      .map((building) => {
        const internalTitle = `FSRE: ${building.address}_${building.id}`

        if (previousEntryNames.find((i) => i === internalTitle)) {
          logger.info('Entry already exists, skipping.', {
            name: internalTitle,
          })
          return null
        }

        return mapEntryCreationDto(building, GENERIC_LIST_ID, REGION_TAGS)
      })
      .filter(isDefined)

    logger.info('creating FSRE building entries...')
    if (!newEntries.length) {
      logger.warn('no FSRE building entries to create')
      return
    }

    await this.cmsRepository.createEntries(newEntries, 'genericListItem')
    logger.info('entries creation finished')
  }

  private async updateEntries(buildings: Array<BuildingDto>): Promise<void> {
    const existingEntries = await this.cmsRepository.getGenericListItemEntries(
      GENERIC_LIST_ID,
    )

    const entriesToUpdate = buildings
      .map((building) => {
        const internalTitle = `FSRE: ${building.address}_${building.id}`
        const matchingEntry = existingEntries.find(
          (i) => i.fields['internalTitle']?.[LOCALE] === internalTitle,
        )
        if (matchingEntry) {
          return mapEntryUpdateDto(matchingEntry, building)
        }
      })
      .filter(isDefined)

    logger.info('updating FSRE building entries...')
    if (!entriesToUpdate.length) {
      logger.warn('no FSRE building entries to update')
      return
    }

    await this.cmsRepository.updateEntries(
      entriesToUpdate,
      'genericListItem',
      false,
    )

    logger.info('entries update finished')
  }
}
