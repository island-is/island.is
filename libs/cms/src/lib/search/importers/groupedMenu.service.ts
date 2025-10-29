import { MappedData } from '@island.is/content-search-indexer/types'
import { logger } from '@island.is/logging'
import { Injectable } from '@nestjs/common'
import { Entry } from 'contentful'
import { IGroupedMenu } from '../../generated/contentfulTypes'
import { mapGroupedMenu } from '../../models/groupedMenu.model'

import { CmsSyncProvider, processSyncDataInput } from '../cmsSync.service'
import { extractChildEntryIds } from './utils'

@Injectable()
export class GroupedMenuSyncService implements CmsSyncProvider<IGroupedMenu> {
  processSyncData(entries: processSyncDataInput<IGroupedMenu>) {
    const entriesToUpdate = entries.filter(
      (entry: Entry<any>): entry is IGroupedMenu =>
        entry.sys.contentType.sys.id === 'groupedMenu',
    )
    return {
      entriesToUpdate,
      entriesToDelete: [],
    }
  }

  doMapping(entries: IGroupedMenu[]) {
    if (entries.length > 0) {
      logger.info('Mapping grouped menu', { count: entries.length })
    }

    return entries
      .map<MappedData | boolean>((entry) => {
        try {
          const mapped = mapGroupedMenu(entry)

          // Tag the document with the ids of its children so we can later look up what document a child belongs to
          const childEntryIds = extractChildEntryIds(entry)

          return {
            _id: mapped.id,
            title: mapped.title,
            type: 'webGroupedMenu',
            response: JSON.stringify({ ...mapped, typename: 'GroupedMenu' }),
            dateCreated: entry.sys.createdAt,
            dateUpdated: new Date().getTime().toString(),
            tags: childEntryIds.map((id) => ({
              key: id,
              type: 'hasChildEntryWithId',
            })),
          }
        } catch (error) {
          logger.warn('Failed to import grouped menu', {
            error: error.message,
            id: entry?.sys?.id,
          })
          return false
        }
      })
      .filter((value): value is MappedData => Boolean(value))
  }
}
