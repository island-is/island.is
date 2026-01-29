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
  mapSlug,
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
    const buildings = await this.clientsRepository.getBuildings()

    if (!buildings || !buildings.length) {
      logger.warn('No buildings to process')
      return
    }

    //first we update the entries
    await this.updateEntries(buildings)

    //then we create the entries, if needed
    await this.createEntries(buildings)
  }

  private async createEntries(buildings: Array<BuildingDto>): Promise<void> {
    const existingEntries = await this.cmsRepository.getGenericListItemEntries(
      GENERIC_LIST_ID,
    )
    const cmsEntrySlugs: Array<string> = existingEntries
      .map((i) => {
        const slug: string = i.fields['slug']?.[LOCALE]
        if (!slug) {
          return null
        }
        return slug
      })
      .filter(isDefined)

    const copy = [...cmsEntrySlugs]

    copy.forEach((c) => {
      const count = cmsEntrySlugs.filter((s) => s === c).length
      if (count > 1) {
        logger.warn('Cms entry slugs contains duplicates', {
          count,
          slug: c,
        })
      }
    })

    const previousSlugsChecked: Array<string> = []

    const newEntries: Array<EntryCreationDto> = buildings
      .map((building) => {
        const slug = mapSlug(building)[LOCALE]

        if (previousSlugsChecked.find((i) => i === slug)) {
          logger.info('Entry already checked, duplicate entry', {
            slug,
          })
          return null
        }

        previousSlugsChecked.push(slug)

        if (cmsEntrySlugs.find((i) => i === mapSlug(building)[LOCALE])) {
          logger.info('Entry already exists in the cms, skipping.', {
            slug,
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
