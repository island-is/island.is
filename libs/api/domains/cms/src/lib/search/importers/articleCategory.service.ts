import { MappedData } from '@island.is/elastic-indexing'
import { logger } from '@island.is/logging'
import { Injectable } from '@nestjs/common'
import { IArticleCategory } from '../../generated/contentfulTypes'
import {
  mapArticleCategory,
  ArticleCategory,
} from '../../models/articleCategory.model'
import { createTerms } from './utils'

@Injectable()
export class ArticleCategorySyncService {
  processSyncData(items) {
    logger.info('Processing sync data for article category')

    return items.filter(
      (item) => item.sys.contentType.sys.id === 'articleCategory',
    )
  }

  doMapping(entries: IArticleCategory[]): MappedData[] {
    logger.info('Mapping article category')

    return entries
      .map<MappedData | boolean>((entry) => {
        let mapped: ArticleCategory

        try {
          mapped = mapArticleCategory(entry)

          return {
            _id: mapped.slug,
            title: mapped.title,
            content: mapped.description,
            type: 'webArticleCategory',
            termPool: createTerms([mapped.title, mapped.description]),
            response: JSON.stringify(mapped),
            dateCreated: entry.sys.createdAt,
            dateUpdated: new Date().getTime().toString(),
          }
        } catch (error) {
          logger.error('Failed to import article category', error)
          return false
        }
      })
      .filter((value): value is MappedData => Boolean(value))
  }
}
