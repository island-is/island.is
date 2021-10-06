import { MappedData } from '@island.is/content-search-indexer/types'
import { logger } from '@island.is/logging'
import { Injectable } from '@nestjs/common'
import { Entry } from 'contentful'
import isCircular from 'is-circular'
import { INews } from '../../generated/contentfulTypes'
import { mapNews } from '../../models/news.model'
import { CmsSyncProvider, processSyncDataInput } from '../cmsSync.service'
import { createTerms, extractStringsFromObject } from './utils'

@Injectable()
export class NewsSyncService implements CmsSyncProvider<INews> {
  processSyncData(entries: processSyncDataInput<INews>) {
    logger.info('Processing sync data for news')

    // only process news that we consider not to be empty and dont have circular structures
    return entries.filter(
      (entry: Entry<any>): entry is INews =>
        entry.sys.contentType.sys.id === 'news' &&
        !!entry.fields.title &&
        !isCircular(entry),
    )
  }

  doMapping(entries: INews[]) {
    logger.info('Mapping news', { count: entries.length })
    return entries
      .map<MappedData | boolean>((entry) => {
        try {
          const mapped = mapNews(entry)
          const content = extractStringsFromObject(mapped.content)
          return {
            _id: mapped.id,
            title: mapped.title,
            content,
            contentWordCount: content.split(/\s+/).length,
            type: 'webNews',
            termPool: createTerms([mapped.title, mapped.intro]),
            response: JSON.stringify({ ...mapped, typename: 'News' }),
            tags: [
              {
                key: mapped.slug,
                type: 'slug',
              },
              ...mapped.genericTags.map((tag) => ({
                // add all tags as meta data to this document so we can query by it later
                key: tag.slug,
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
