import { MappedData } from '@island.is/content-search-indexer/types'
import { logger } from '@island.is/logging'
import { Injectable } from '@nestjs/common'
import { Entry } from 'contentful'
import { ILink, IGenericList } from '../../generated/contentfulTypes'
import { CmsSyncProvider, processSyncDataInput } from '../cmsSync.service'
import { mapGenericList } from '../../models/genericList.model'

@Injectable()
export class GenericListSyncService implements CmsSyncProvider<IGenericList> {
  processSyncData(entries: processSyncDataInput<ILink>) {
    return entries.filter(
      (entry: Entry<unknown>): entry is IGenericList =>
        entry.sys.contentType.sys.id === 'genericList',
    )
  }

  doMapping(entries: IGenericList[]) {
    if (entries.length > 0) {
      logger.info('Mapping generic lists', { count: entries.length })
    }

    return entries
      .map<MappedData | boolean>((entry) => {
        try {
          const mapped = mapGenericList(entry)
          return {
            _id: mapped.id,
            title: entry.fields.internalTitle ?? '',
            type: 'webGenericList',
            response: JSON.stringify({ ...mapped, typename: 'GenericList' }),
            dateCreated: entry.sys.createdAt,
            dateUpdated: new Date().getTime().toString(),
          }
        } catch (error) {
          logger.warn('Failed to import generic list', {
            error: error.message,
            id: entry?.sys?.id,
          })
          return false
        }
      })
      .filter((value): value is MappedData => Boolean(value))
  }
}
