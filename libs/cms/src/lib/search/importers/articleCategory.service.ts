import { MappedData } from '@island.is/content-search-indexer/types'
import { logger } from '@island.is/logging'
import { Injectable } from '@nestjs/common'
import { Entry } from 'contentful'
import isCircular from 'is-circular'
import { IArticleCategory } from '../../generated/contentfulTypes'
import { mapArticleCategory } from '../../models/articleCategory.model'
import { CmsSyncProvider, processSyncDataInput } from '../cmsSync.service'
import { createTerms } from './utils'

@Injectable()
export class ArticleCategorySyncService
  implements CmsSyncProvider<IArticleCategory>
{
  processSyncData(entries: processSyncDataInput<IArticleCategory>) {
    // only process articles that we consider not to be empty and dont have circular structures
    const entriesToUpdate = entries.filter(
      (entry: Entry<any>): entry is IArticleCategory =>
        entry.sys.contentType.sys.id === 'articleCategory' &&
        !!entry.fields.title &&
        !isCircular(entry),
    )

    return {
      entriesToUpdate,
      entriesToDelete: [],
    }
  }

  doMapping(entries: IArticleCategory[]) {
    if (entries.length > 0) {
      logger.info('Mapping article category', { count: entries.length })
    }

    return entries
      .map<MappedData | boolean>((entry) => {
        try {
          const mapped = mapArticleCategory(entry)
          const content = mapped.description ?? ''
          return {
            _id: mapped.id,
            title: mapped.title,
            content,
            contentWordCount: content.split(/\s+/).length,
            type: 'webArticleCategory',
            termPool: createTerms([mapped.title, content]),
            response: JSON.stringify({
              ...mapped,
              typename: 'ArticleCategory',
            }),
            dateCreated: entry.sys.createdAt,
            dateUpdated: new Date().getTime().toString(),
          }
        } catch (error) {
          logger.warn('Failed to import article category', {
            error: error.message,
            id: entry?.sys?.id,
          })
          return false
        }
      })
      .filter((value): value is MappedData => Boolean(value))
  }
}
