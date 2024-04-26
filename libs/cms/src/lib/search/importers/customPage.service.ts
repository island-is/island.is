import isCircular from 'is-circular'
import { Injectable } from '@nestjs/common'
import { logger } from '@island.is/logging'
import { MappedData } from '@island.is/content-search-indexer/types'
import { ICustomPage } from '../../generated/contentfulTypes'
import { mapCustomPage } from '../../models/customPage.model'
import { CmsSyncProvider, processSyncDataInput } from '../cmsSync.service'

@Injectable()
export class CustomPageSyncService implements CmsSyncProvider<ICustomPage> {
  processSyncData(entries: processSyncDataInput<ICustomPage>) {
    return entries.filter(
      (entry) =>
        entry.sys.contentType.sys.id === 'customPage' &&
        entry.fields.uniqueIdentifier,
    )
  }

  doMapping(entries: ICustomPage[]) {
    if (entries.length > 0) {
      logger.info('Mapping custom pages', { count: entries.length })
    }
    return entries
      .map<MappedData | boolean>((entry) => {
        try {
          const mapped = mapCustomPage(entry)
          if (isCircular(mapped)) {
            logger.warn('Circular reference found in custom page', {
              id: entry.sys.id,
            })
            return false
          }

          return {
            _id: mapped.id,
            title: entry.fields.title || '',
            type: 'webCustomPage',
            response: JSON.stringify(mapped),
            tags: [
              {
                key: mapped.uniqueIdentifier,
                type: 'slug',
              },
            ],
            dateCreated: entry.sys.createdAt,
            dateUpdated: new Date().getTime().toString(),
          }
        } catch (error) {
          logger.warn('Failed to import custom page', {
            error: error.message,
            id: entry?.sys?.id,
          })
          return false
        }
      })
      .filter((value): value is MappedData => Boolean(value))
  }
}
