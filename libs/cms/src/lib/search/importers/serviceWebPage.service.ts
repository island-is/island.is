import { MappedData } from '@island.is/content-search-indexer/types'
import { logger } from '@island.is/logging'
import { Injectable } from '@nestjs/common'
import { Entry } from 'contentful'
import { IServiceWebPage } from '../../generated/contentfulTypes'
import { CmsSyncProvider, processSyncDataInput } from '../cmsSync.service'
import { mapServiceWebPage } from '../../models/serviceWebPage.model'

@Injectable()
export class ServiceWebPageSyncService
  implements CmsSyncProvider<IServiceWebPage>
{
  processSyncData(entries: processSyncDataInput<IServiceWebPage>) {
    return entries.filter(
      (entry: Entry<any>): entry is IServiceWebPage =>
        entry.sys.contentType.sys.id === 'serviceWebPage' &&
        !!entry.fields.title,
    )
  }

  doMapping(entries: IServiceWebPage[]) {
    logger.info('Mapping Service Web page', { count: entries.length })

    return entries
      .map<MappedData | boolean>((entry) => {
        try {
          const mapped = mapServiceWebPage(entry)
          return {
            _id: mapped.id,
            title: mapped.title,
            type: 'webServiceWebPage',
            response: JSON.stringify({
              ...mapped,
              typename: 'ServiceWebPage',
            }),
            tags: entry.fields?.organization?.fields?.slug
              ? [
                  {
                    key: entry.fields.organization.fields.slug,
                    type: 'slug',
                  },
                ]
              : [],
            dateCreated: entry.sys.createdAt,
            dateUpdated: new Date().getTime().toString(),
          }
        } catch (error) {
          logger.warn('Failed to import Service Web page', {
            error: error.message,
            id: entry?.sys?.id,
          })
          return false
        }
      })
      .filter((value): value is MappedData => Boolean(value))
  }
}
