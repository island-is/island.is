import { Injectable } from '@nestjs/common'
import { CmsRepository } from '../repositories/cms/cms.repository'
import { logger } from '@island.is/logging'
import { EnergyGrantsRepository } from '../repositories/energy-grants/energyGrants.repository'
import { EntryCreationDto } from '../repositories/cms/cms.types'
import { isDefined } from '@island.is/shared/utils'
import { LOCALE } from '../constants'
import { PREVIOUS_RECIPIENTS_GENERIC_LIST_ID, UOS_TAGS } from './constants'
import {
  mapEntryCreationDto,
  mapEntryUpdateDto,
} from '../repositories/energy-grants/mapper'
import { EnergyGrantCollectionDto } from '../repositories/energy-grants/dto/energyGrantCollection.dto'

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
    const grants = await this.clientsRepository.getEnergyGrants(20)

    if (!grants) {
      logger.warn('No grants to process')
      return
    }

    //first we create the entries
    await this.createEntries(grants)
    //then we update the entries
    await this.updateEntries(grants)
  }

  private async createEntries(grants: EnergyGrantCollectionDto): Promise<void> {
    const existingEntries = await this.cmsRepository.getGenericListItemEntries(
      PREVIOUS_RECIPIENTS_GENERIC_LIST_ID,
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

    const newEntries: Array<EntryCreationDto> = grants.grants
      .map((eg) => {
        if (previousEntryNames.find((i) => i === eg.projectName)) {
          logger.info('Entry already exists, skipping.', {
            name: eg.projectName,
          })
          return null
        }

        return mapEntryCreationDto(
          eg,
          PREVIOUS_RECIPIENTS_GENERIC_LIST_ID,
          UOS_TAGS,
        )
      })
      .filter(isDefined)

    logger.info('creating energy fund entries...')
    if (!newEntries.length) {
      logger.warn('no  energy fund entries to create')
      return
    }

    await this.cmsRepository.createEntries(newEntries, 'genericListItem')
    logger.info('entries creation finished')
  }

  private async updateEntries(grants: EnergyGrantCollectionDto): Promise<void> {
    const existingEntries = await this.cmsRepository.getGenericListItemEntries(
      PREVIOUS_RECIPIENTS_GENERIC_LIST_ID,
    )

    const entriesToUpdate = grants.grants
      .map((eg) => {
        const matchingEntry = existingEntries.find(
          (i) => i.fields['internalTitle']?.[LOCALE] === eg.projectName,
        )
        if (matchingEntry) {
          return mapEntryUpdateDto(matchingEntry, eg)
        }
      })
      .filter(isDefined)

    logger.info('updating energy fund entries...')
    if (!entriesToUpdate.length) {
      logger.warn('no energy fund entries to update')
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
