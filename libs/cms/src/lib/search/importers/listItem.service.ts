import { MappedData } from '@island.is/content-search-indexer/types'
import { logger } from '@island.is/logging'
import { Injectable } from '@nestjs/common'
import { Entry } from 'contentful'
import { ILink, IListItem } from '../../generated/contentfulTypes'
import { CmsSyncProvider, processSyncDataInput } from '../cmsSync.service'
import { mapListItem } from '../../models/listItem.model'
import {
  extractStringsFromObject,
  pruneNonSearchableSliceUnionFields,
} from './utils'

@Injectable()
export class ListItemSyncService implements CmsSyncProvider<IListItem> {
  processSyncData(entries: processSyncDataInput<ILink>) {
    return entries.filter(
      (entry: Entry<any>): entry is IListItem =>
        entry.sys.contentType.sys.id === 'listItem' && entry.fields.relativeUrl,
    )
  }

  doMapping(entries: IListItem[]) {
    if (entries.length > 0) {
      logger.info('Mapping list items', { count: entries.length })
    }

    return entries
      .map<MappedData | boolean>((entry) => {
        try {
          const mapped = mapListItem(entry)

          const content = extractStringsFromObject(
            mapped.thumbnailContent?.map(pruneNonSearchableSliceUnionFields) ??
              [],
          )

          return {
            _id: mapped.id,
            title: mapped.title,
            content: content,
            contentWordCount: content.split(/\s+/).length,
            type: 'webListItem',
            response: JSON.stringify({ ...mapped, typename: 'ListItem' }),
            dateCreated: entry.sys.createdAt,
            dateUpdated: new Date().getTime().toString(),
            tags: [
              {
                type: 'referencedBy',
                key: mapped.listPage.id,
              },
            ],
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
