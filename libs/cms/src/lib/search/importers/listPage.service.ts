import { MappedData } from '@island.is/content-search-indexer/types'
import { logger } from '@island.is/logging'
import { Injectable } from '@nestjs/common'
import { Entry } from 'contentful'
import { ILink, IListPage } from '../../generated/contentfulTypes'
import { CmsSyncProvider, processSyncDataInput } from '../cmsSync.service'
import { mapListPage } from '../../models/listPage.model'

@Injectable()
export class ListPageSyncService implements CmsSyncProvider<IListPage> {
  processSyncData(entries: processSyncDataInput<ILink>) {
    return entries.filter(
      (entry: Entry<any>): entry is IListPage =>
        entry.sys.contentType.sys.id === 'listPage' && entry.fields.relativeUrl,
    )
  }

  doMapping(entries: IListPage[]) {
    if (entries.length > 0) {
      logger.info('Mapping list pages', { count: entries.length })
    }

    return entries
      .map<MappedData | boolean>((entry) => {
        try {
          const mapped = mapListPage(entry)
          return {
            _id: mapped.id,
            title: mapped.title,
            type: 'webListPage',
            response: JSON.stringify({ ...mapped, typename: 'ListPage' }),
            dateCreated: entry.sys.createdAt,
            dateUpdated: new Date().getTime().toString(),
          }
        } catch (error) {
          logger.warn('Failed to import list page', {
            error: error.message,
            id: entry?.sys?.id,
          })
          return false
        }
      })
      .filter((value): value is MappedData => Boolean(value))
  }
}
