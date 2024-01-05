import { MappedData } from '@island.is/content-search-indexer/types'
import { logger } from '@island.is/logging'
import { Injectable } from '@nestjs/common'
import { Entry } from 'contentful'
import { IOrganizationPage } from '../../generated/contentfulTypes'
import { CmsSyncProvider, processSyncDataInput } from '../cmsSync.service'
import { mapOrganizationPage } from '../../models/organizationPage.model'

@Injectable()
export class OrganizationPageSyncService
  implements CmsSyncProvider<IOrganizationPage>
{
  processSyncData(entries: processSyncDataInput<IOrganizationPage>) {
    return entries.filter(
      (entry: Entry<any>): entry is IOrganizationPage =>
        entry.sys.contentType.sys.id === 'organizationPage' &&
        !!entry.fields.title,
    )
  }

  doMapping(entries: IOrganizationPage[]) {
    logger.info('Mapping organization page', { count: entries.length })

    return entries
      .map<MappedData | boolean>((entry) => {
        try {
          const mapped = mapOrganizationPage(entry)
          return {
            _id: mapped.id,
            title: mapped.title,
            type: 'webOrganizationPage',
            response: JSON.stringify({
              ...mapped,
              typename: 'OrganizationPage',
            }),
            tags: [
              {
                key: entry.fields?.slug,
                type: 'slug',
              },
            ],
            dateCreated: entry.sys.createdAt,
            dateUpdated: new Date().getTime().toString(),
          }
        } catch (error) {
          logger.warn('Failed to import organization page', {
            error: error.message,
            id: entry?.sys?.id,
          })
          return false
        }
      })
      .filter((value): value is MappedData => Boolean(value))
  }
}
