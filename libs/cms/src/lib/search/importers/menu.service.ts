import { MappedData } from '@island.is/content-search-indexer/types'
import { logger } from '@island.is/logging'
import { Injectable } from '@nestjs/common'
import { Entry } from 'contentful'
import { IMenu } from '../../generated/contentfulTypes'
import { mapMenu } from '../../models/menu.model'
import { CmsSyncProvider, processSyncDataInput } from '../cmsSync.service'
import { extractChildEntryIds } from './utils'

@Injectable()
export class MenuSyncService implements CmsSyncProvider<IMenu> {
  processSyncData(entries: processSyncDataInput<IMenu>) {
    const entriesToUpdate = entries.filter(
      (entry: Entry<any>): entry is IMenu =>
        entry.sys.contentType.sys.id === 'menu',
    )
    return {
      entriesToUpdate,
      entriesToDelete: [],
    }
  }

  doMapping(entries: IMenu[]) {
    if (entries.length > 0) {
      logger.info('Mapping menu', { count: entries.length })
    }
    return entries
      .map<MappedData | boolean>((entry) => {
        try {
          const mapped = mapMenu(entry)

          // Tag the document with the ids of its children so we can later look up what document a child belongs to
          const childEntryIds = extractChildEntryIds(entry)

          return {
            _id: mapped.id,
            title: mapped.title,
            type: 'webMenu',
            response: JSON.stringify({ ...mapped, typename: 'Menu' }),
            tags: [
              {
                key: mapped.title,
                type: 'name',
              },
              ...childEntryIds.map((id) => ({
                key: id,
                type: 'hasChildEntryWithId',
              })),
            ],
            dateCreated: entry.sys.createdAt,
            dateUpdated: new Date().getTime().toString(),
          }
        } catch (error) {
          logger.warn('Failed to import menu', {
            error: error.message,
            id: entry?.sys?.id,
          })
          return false
        }
      })
      .filter((value): value is MappedData => Boolean(value))
  }
}
