import { Inject, Injectable } from '@nestjs/common'
import { CmsRepository } from '../repositories/cms/cms.repository'
import { logger } from '@island.is/logging'
import { ClientAPI } from 'contentful-management'
import { EntryCreationDto } from '../repositories/cms/cms.types'
import { isDefined } from '@island.is/shared/utils'
import { ENVIRONMENT, LOCALE, SPACE_ID } from '../constants'
import { FSREBuildingsRepository } from '../repositories/fsre-buildings/fsreBuildings.repository'
import { GENERIC_LIST_ID, REGION_TAGS } from './constants'
import { mapFSREBuildingToGenericListItem } from '../repositories/fsre-buildings/mapper'

@Injectable()
export class FSREBuildingsImportService {
  constructor(
    private readonly cmsRepository: CmsRepository,
    private readonly clientsRepository: FSREBuildingsRepository,
    @Inject('contentful-management-client')
    private readonly client: ClientAPI,
  ) {}

  public async run() {
    logger.info('FSRE buildings import worker starting...')
    await this.processEntries()
    logger.info('...FSRE buildings import worker finished.')
  }

  private async processEntries() {
    const buildings = await this.clientsRepository.getBuildings()

    if (buildings) {
      const existingEntries =
        await this.cmsRepository.getGenericListItemEntries(GENERIC_LIST_ID)

      const newEntries: Array<EntryCreationDto> = buildings
        .map((eg) => {
          if (
            existingEntries.find(
              (i) =>
                i.fields['internalTitle']?.[LOCALE] ===
                `FSRE: ${eg.address}_${eg.id}`,
            )
          ) {
            logger.info('Entry already exists, skipping.', {
              name: eg.address,
            })
            return null
          }

          return mapFSREBuildingToGenericListItem(
            eg,
            GENERIC_LIST_ID,
            REGION_TAGS,
          )
        })
        .filter(isDefined)

      logger.info('creating FSRE building entries...')
      if (!newEntries.length) {
        logger.warn('no FSRE building entries to create')
        return [
          {
            ok: true,
            error: 'no FSRE building entries to create',
          },
        ]
      }

      for (const entry of newEntries) {
        logger.warn('entry', entry.fields['internalTitle'])
        const createdEntry = await this.client
          .getSpace(SPACE_ID)
          .then((space) => space.getEnvironment(ENVIRONMENT))
          .then((env) => env.createEntry('genericListItem', entry))
          .then((res) => ({ ok: true as const, data: res }))
          .catch((e) => ({
            ok: false as const,
            error: e,
          }))
        logger.info('createdEntry', createdEntry)
      }
    }
  }
}
