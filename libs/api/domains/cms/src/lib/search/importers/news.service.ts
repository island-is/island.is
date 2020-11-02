import { MappedData } from '@island.is/api/content-search'
import { logger } from '@island.is/logging'
import { Injectable } from '@nestjs/common'
import { INews } from '../../generated/contentfulTypes'
import { mapNews } from '../../models/news.model'
import { createTerms, extractStringsFromObject } from './utils'

@Injectable()
export class NewsSyncService {
  processSyncData(items) {
    logger.info('Processing sync data for news')

    return items.filter((item) => item.sys.contentType.sys.id === 'news')
  }

  doMapping(entries: INews[]): MappedData[] {
    logger.info('Mapping news', { count: entries.length })
    return entries
      .map<MappedData | boolean>((entry) => {
        try {
          const mapped = mapNews(entry)

          // we consider news that dont have a title to be empty
          if (!mapped.title) {
            throw new Error('Trying to import empty news entry')
          }

          const type = 'webNews'
          return {
            _id: mapped.id,
            title: mapped.title,
            content: extractStringsFromObject(mapped.content),
            type,
            termPool: createTerms([mapped.title, mapped.intro]),
            response: JSON.stringify({ ...mapped, __typename: type }),
            tags: [
              {
                key: mapped.slug,
                type: 'slug',
              },
              ...mapped.genericTags.map((tag) => ({
                // add all tags as meta data to this document so we can query by it later
                key: tag.id,
                type: 'genericTag',
                value: tag.title,
              })),
            ],
            dateCreated: mapped.date || entry.sys.createdAt,
            dateUpdated: new Date().getTime().toString(),
          }
        } catch (error) {
          logger.warn('Failed to import news', { error: error.message })
          return false
        }
      })
      .filter((value): value is MappedData => Boolean(value))
  }
}
