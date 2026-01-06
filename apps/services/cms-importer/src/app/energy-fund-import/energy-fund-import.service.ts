import { Inject, Injectable } from '@nestjs/common'
import { CmsRepository } from '../repositories/cms/cms.repository'
import { logger } from '@island.is/logging'
import { EnergyGrantsRepository } from '../repositories/energy-grants/energyGrants.repository'
import { ClientAPI } from 'contentful-management'
import { CreationType } from '../repositories/cms/cms.types'
import { isDefined } from '@island.is/shared/utils'
import { ENVIRONMENT, LOCALE,  } from '../constants'
import { PREVIOUS_RECIPIENTS_GENERIC_LIST_ID, UOS_TAGS } from './constants'
import { mapCreationType } from '../repositories/energy-grants/mapper'
import { EnergyGrantCollectionDto } from '../repositories/energy-grants/dto/energyGrantCollection.dto'

@Injectable()
export class EnergyFundImportService {
  constructor(
    private readonly cmsRepository: CmsRepository,
    private readonly clientsRepository: EnergyGrantsRepository,
    @Inject('contentful-management-client')
    private readonly client: ClientAPI,
  ) {}

  public async run() {
    logger.info('Energy fund import worker starting...')
    await this.processEnergyGrants()
    logger.info('...Energy fund import worker finished.')
  }

  private async processEnergyGrants() {
    const grants = await this.clientsRepository.getEnergyGrants(20)

    if (grants) {
      this.createEntries(grants)
    }
  }

  private async createEntries(grants: EnergyGrantCollectionDto) {
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

    const newEntries: Array<CreationType> = grants.grants
      .map((eg) => {
        if (previousEntryNames.find((i) => i === eg.projectName)) {
          logger.info('Entry already exists, skipping.', {
            name: eg.projectName,
          })
          return null
        }

        return mapCreationType(
          eg,
          PREVIOUS_RECIPIENTS_GENERIC_LIST_ID,
          UOS_TAGS,
        )
      })
      .filter(isDefined)

    logger.info('creating energy fund entries...')
    if (!newEntries.length) {
      logger.warn('no  energy fund entries to create')
      return [
        {
          ok: true,
          error: 'no energy fund entries to create',
        },
      ]
    }

    const responses = await this.cmsRepository.createEntries(
      newEntries,
      'grant',
    )

    responses.forEach((response) => {
      if (response.status === 'success') {
        logger.info('createdEntry', response.entry)
      } else {
        logger.info('entry creation failed', response.error)
      }
    })
  }

  private async updateEntries(grants: EnergyGrantCollectionDto) {
    const existingEntries = await this.cmsRepository.getGenericListItemEntries(
      PREVIOUS_RECIPIENTS_GENERIC_LIST_ID,
    )

    const entriesToUpdate = grants.grants
      .map((eg) => {
        const matchingEntry = existingEntries.find(i => i.fields['internalTitle']?.[LOCALE] === eg.projectName)
        if (matchingEntry) {
          return eg.
        }

        return mapEnergyGrantToGenericListItem(
          eg,
          PREVIOUS_RECIPIENTS_GENERIC_LIST_ID,
          UOS_TAGS,
        )a
      })
      .filter(isDefined)
  }
}
