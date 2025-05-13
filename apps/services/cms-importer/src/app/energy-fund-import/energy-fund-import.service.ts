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
    const grants = await this.clientsRepository.getEnergyGrants(5)

    if (grants) {
      const newEntries: Array<CreationType> = grants.grants
        .map((eg) => mapEnergyGrantToGenericListItem(eg))
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
        const createdEntry = await this.client
          .getSpace(SPACE_ID)
          .then((space) => space.getEnvironment(ENVIRONMENT))
          .then((env) => env.createEntry('genericListItem', entry))
          .then((res) => ({ ok: true as const, data: res }))
          .catch((e) => ({
            ok: false as const,
            error: e,
          }))
        logger.warn('createdEntry', createdEntry)
      }
    }
  }
}
