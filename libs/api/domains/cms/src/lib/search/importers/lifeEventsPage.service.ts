import { MappedData } from '@island.is/elastic-indexing'
import { logger } from '@island.is/logging'
import { Injectable } from '@nestjs/common'
import { ILifeEventPage } from '../../generated/contentfulTypes'
import {
  LifeEventPage,
  mapLifeEventPage,
} from '../../models/lifeEventPage.model'
import { createTerms } from './utils'

@Injectable()
export class LifeEventsPageSyncService {
  processSyncData(items) {
    logger.info('Processing sync data for life event pages')

    const lifeEventPages = items.filter(
      (item) => item.sys.contentType.sys.id === 'lifeEventPage',
    )

    logger.info('Found live event pages', { count: lifeEventPages.length })
    return lifeEventPages
  }

  doMapping(entries: ILifeEventPage[]): MappedData[] {
    logger.info('Mapping life event pages')
    return entries
      .map<MappedData | boolean>((entry) => {
        let mapped: LifeEventPage
        try {
          mapped = mapLifeEventPage(entry)
        } catch (error) {
          logger.error('Failed to import life event page', error)
          return false
        }

        return {
          _id: mapped.id,
          title: mapped.title,
          content: mapped.intro,
          type: 'webLifeEventPage',
          termPool: createTerms([mapped.title]),
          response: JSON.stringify(mapped),
          tags: [],
          dateCreated: entry.sys.createdAt,
          dateUpdated: new Date().getTime().toString(),
        }
      })
      .filter((value): value is MappedData => Boolean(value))
  }
}
