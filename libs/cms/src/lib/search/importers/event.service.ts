import { Entry } from 'contentful'
import isCircular from 'is-circular'
import { Injectable } from '@nestjs/common'
import { MappedData } from '@island.is/content-search-indexer/types'
import { logger } from '@island.is/logging'
import { IEvent } from '../../generated/contentfulTypes'
import { mapEvent } from '../../models/event.model'
import { CmsSyncProvider, processSyncDataInput } from '../cmsSync.service'
import { createTerms, extractStringsFromObject } from './utils'

@Injectable()
export class EventSyncService implements CmsSyncProvider<IEvent> {
  processSyncData(entries: processSyncDataInput<IEvent>) {
    logger.info('Processing sync data for events')

    // only process events that we consider not to be empty
    return entries.filter(
      (entry: Entry<any>): entry is IEvent =>
        entry.sys.contentType.sys.id === 'event' &&
        !!entry.fields.title &&
        !!entry.fields.startDate &&
        !!entry.fields.slug,
    )
  }

  doMapping(entries: IEvent[]) {
    logger.info('Mapping Event', { count: entries.length })
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

          const content = extractStringsFromObject(mapped.content)

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

          return {
            _id: mapped.id,
            title: mapped.title,
            content,
            contentWordCount: content.split(/\s+/).length,
            type: 'webEvent',
            termPool: createTerms([mapped.title]),
            response: JSON.stringify({ ...mapped, typename: 'Event' }),
            tags,
            dateCreated: mapped.date,
            dateUpdated: new Date().getTime().toString(),
            releaseDate: entry.sys.createdAt,
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
