import isCircular from 'is-circular'
import { Injectable } from '@nestjs/common'
import { logger } from '@island.is/logging'
import { MappedData } from '@island.is/content-search-indexer/types'
import { ICustomPage } from '../../generated/contentfulTypes'
import { mapCustomPage } from '../../models/customPage.model'
import { CmsSyncProvider, processSyncDataInput } from '../cmsSync.service'
import { extractChildEntryIds } from './utils'

@Injectable()
export class CustomPageSyncService implements CmsSyncProvider<ICustomPage> {
  processSyncData(entries: processSyncDataInput<ICustomPage>) {
    const entriesToUpdate = entries.filter(
      (entry) =>
        entry.sys.contentType.sys.id === 'customPage' &&
        (entry.fields.uniqueIdentifier || entry.fields.parentPage?.sys?.id),
    )
    return {
      entriesToUpdate,
      entriesToDelete: [],
    }
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

          const tags =
            entry.fields.parentPage?.sys?.id && entry.fields.slug
              ? [
                  {
                    key: entry.fields.slug,
                    type: 'slug',
                  },
                  {
                    key: entry.fields.parentPage.sys.id,
                    type: 'referencedBy',
                  },
                ]
              : [
                  {
                    key: mapped.uniqueIdentifier,
                    type: 'slug',
                  },
                ]

          // Tag the document with the ids of its children so we can later look up what document a child belongs to
          const childEntryIds = extractChildEntryIds(entry)
          for (const id of childEntryIds) {
            tags.push({
              key: id,
              type: 'hasChildEntryWithId',
            })
          }

          return {
            _id: mapped.id,
            title: entry.fields.title || '',
            type: 'webCustomPage',
            response: JSON.stringify(mapped),
            tags,
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
