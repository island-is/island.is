import { Entry } from 'contentful'
import isCircular from 'is-circular'
import { Injectable } from '@nestjs/common'
import { MappedData } from '@island.is/content-search-indexer/types'
import { logger } from '@island.is/logging'
import { IEvent } from '../../generated/contentfulTypes'
import { mapEvent } from '../../models/event.model'
import { CmsSyncProvider, processSyncDataInput } from '../cmsSync.service'
import {
  createTerms,
  extractChildEntryIds,
  extractStringsFromObject,
  pruneNonSearchableSliceUnionFields,
} from './utils'

@Injectable()
export class EventSyncService implements CmsSyncProvider<IEvent> {
  processSyncData(entries: processSyncDataInput<IEvent>) {
    // only process events that we consider not to be empty
    const entriesToUpdate = entries.filter(
      (entry: Entry<any>): entry is IEvent =>
        entry.sys.contentType.sys.id === 'event' &&
        !!entry.fields.title &&
        !!entry.fields.startDate &&
        !!entry.fields.slug &&
        !!entry.fields.thumbnailImage,
    )
    return {
      entriesToUpdate,
      entriesToDelete: [],
    }
  }

  doMapping(entries: IEvent[]) {
    if (entries.length > 0) {
      logger.info('Mapping Event', { count: entries.length })
    }
    return entries
      .map<MappedData | boolean>((entry) => {
        try {
          const mapped = mapEvent(entry)
          if (isCircular(mapped)) {
            logger.warn('Circular reference found in event', {
              id: entry?.sys?.id,
            })
            return false
          }

          const content = extractStringsFromObject(
            mapped.content.map(pruneNonSearchableSliceUnionFields),
          )

          const tags = [
            {
              key: mapped.slug,
              type: 'slug',
            },
          ]

          if (mapped.organization?.slug) {
            tags.push({
              key: mapped.organization.slug,
              type: 'organization',
            })
          }

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
            title: mapped.title,
            content,
            contentWordCount: content.split(/\s+/).length,
            type: 'webEvent',
            termPool: createTerms([mapped.title]),
            response: JSON.stringify({ ...mapped, typename: 'Event' }),
            tags,
            dateCreated: mapped.startDate,
            dateUpdated: new Date().getTime().toString(),
            releaseDate: mapped.endDate || mapped.startDate,
          }
        } catch (error) {
          logger.warn('Failed to import Event', {
            error: error.message,
            id: entry?.sys?.id,
          })
          return false
        }
      })
      .filter((value): value is MappedData => Boolean(value))
  }
}
