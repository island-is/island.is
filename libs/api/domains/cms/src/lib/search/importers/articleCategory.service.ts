import { MappedData } from '@island.is/api/content-search'
import { logger } from '@island.is/logging'
import { Injectable } from '@nestjs/common'
import { IArticleCategory } from '../../generated/contentfulTypes'
import { mapArticleCategory } from '../../models/articleCategory.model'
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
    logger.info('Mapping article category', { count: entries.length })

    return entries
      .map<MappedData | boolean>((entry) => {
        try {
          const mapped = mapArticleCategory(entry)

          // we consider article categories that dont have a title to be empty
          if (!mapped.title) {
            throw new Error('Trying to import empty article category entry')
          }

          const type = 'webArticleCategory'
          return {
            _id: mapped.slug,
            title: mapped.title,
            content: mapped.description,
            type,
            termPool: createTerms([mapped.title, mapped.description]),
            response: JSON.stringify({ ...mapped, __typename: type }),
            dateCreated: entry.sys.createdAt,
            dateUpdated: new Date().getTime().toString(),
          }
        } catch (error) {
          logger.warn('Failed to import article category', error)
          return false
        }
      })
      .filter((value): value is MappedData => Boolean(value))
  }
}
