import { MappedData } from '@island.is/api/content-search'
import { logger } from '@island.is/logging'
import { Injectable } from '@nestjs/common'
import { ILifeEventPage } from '../../generated/contentfulTypes'
import { mapLifeEventPage } from '../../models/lifeEventPage.model'
import { createTerms, extractStringsFromObject } from './utils'

@Injectable()
export class LifeEventsPageSyncService {
  processSyncData(items) {
    logger.info('Processing sync data for life event pages')

    return items.filter(
      (item) => item.sys.contentType.sys.id === 'lifeEventPage',
    )
  }

  doMapping(entries: ILifeEventPage[]): MappedData[] {
    logger.info('Mapping life event pages', { count: entries.length })
    return entries
      .map<MappedData | boolean>((entry) => {
        try {
          const mapped = mapLifeEventPage(entry)

          // we consider life events that dont have a title to be empty
          if (!mapped.title) {
            throw new Error('Trying to import empty life event entry')
          }

          const type = 'webLifeEventPage'
          return {
            _id: mapped.id,
            title: mapped.title,
            content: extractStringsFromObject(mapped.content),
            type,
            termPool: createTerms([mapped.title]),
            response: JSON.stringify({ ...mapped, __typename: type }),
            tags: [],
            dateCreated: entry.sys.createdAt,
            dateUpdated: new Date().getTime().toString(),
          }
        } catch (error) {
          logger.warn('Failed to import life event page', error)
          return false
        }
      })
      .filter((value): value is MappedData => Boolean(value))
  }
}
