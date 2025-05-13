import { Inject, Injectable } from '@nestjs/common'
import { CmsRepository } from '../repositories/cms/cms.repository'
import { logger } from '@island.is/logging'
import { EnergyGrantsRepository } from '../repositories/energyGrants/energyGrants.repository'
import { ClientAPI, Entry } from 'contentful-management'
import { CreationType } from '../repositories/cms/cms.types'
import { isDefined } from '@island.is/shared/utils'
import { mapEnergyGrantToGenericListItem } from '../repositories/cms/mapper'
import { ContentfulFetchResponse } from '../repositories/cms/managementClient/managementClient.types'
import {
  ENVIRONMENT,
  GENERIC_LIST_ITEM_CONTENT_TYPE,
  LOCALE,
  PREVIOUS_RECIPIENTS_GENERIC_LIST_ID,
  SPACE_ID,
} from '../constants'

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
    const grants = await this.clientsRepository.getEnergyGrants(10)

    if (grants) {
      const existingEntries = await this.client
        .getSpace(SPACE_ID)
        .then((space) => space.getEnvironment(ENVIRONMENT))
        .then((environment) =>
          environment.getEntries({
            content_type: GENERIC_LIST_ITEM_CONTENT_TYPE,
            select: 'fields,sys,metadata',
            links_to_entry: PREVIOUS_RECIPIENTS_GENERIC_LIST_ID,
          }),
        )
        .then((entries) => ({ ok: true as const, data: entries }))
        .catch((e) => ({
          ok: false as const,
          error: e,
        }))

      if (!existingEntries?.ok) {
        logger.warn(`cms service failed to fetch previous energy fund grants`, {
          error: existingEntries.error,
        })
        return
      }

      const previousEntryNames: Array<string> = existingEntries.data.items
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

          return mapEnergyGrantToGenericListItem(eg)
        })
        .filter(isDefined)

      logger.info('creating entries...')
      if (!newEntries.length) {
        logger.warn('no entries to create')
        return [
          {
            ok: true,
            error: 'no entries to create',
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
        //  logger.warn('createdEntry', createdEntry)
      }
    }
  }
}
