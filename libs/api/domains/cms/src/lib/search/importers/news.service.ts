import { MappedData } from '@island.is/api/content-search'
import { logger } from '@island.is/logging'
import { Injectable } from '@nestjs/common'
import { Entry } from 'contentful'
import isCircular from 'is-circular'
import { INews } from '../../generated/contentfulTypes'
import { mapNews } from '../../models/news.model'
import { createTerms, extractStringsFromObject } from './utils'

@Injectable()
export class NewsSyncService {
  processSyncData(entries: Entry<any>[]): INews[] {
    logger.info('Processing sync data for news')

    // only process news that we consider not to be empty and dont have circular structures
    return entries.filter(
      (entry: Entry<any>): entry is INews =>
        entry.sys.contentType.sys.id === 'news' &&
        !!entry.fields.title &&
        !isCircular(entry),
    )
  }

  doMapping(entries: INews[]): MappedData[] {
    logger.info('Mapping news', { count: entries.length })
    return entries
      .map<MappedData | boolean>((entry) => {
        try {
          const mapped = mapNews(entry)
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
