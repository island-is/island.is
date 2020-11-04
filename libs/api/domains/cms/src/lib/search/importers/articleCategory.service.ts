import { MappedData } from '@island.is/api/content-search'
import { logger } from '@island.is/logging'
import { Injectable } from '@nestjs/common'
import { Entry } from 'contentful'
import isCircular from 'is-circular'
import { IArticleCategory } from '../../generated/contentfulTypes'
import { mapArticleCategory } from '../../models/articleCategory.model'
import {
  CmsSyncProvider,
  doMappingInput,
  processSyncDataInput,
} from '../cmsSync.service'
import { createTerms } from './utils'

@Injectable()
export class ArticleCategorySyncService
  implements CmsSyncProvider<IArticleCategory> {
  processSyncData(entries: processSyncDataInput<IArticleCategory>) {
    logger.info('Processing sync data for article category')

    // only process articles that we consider not to be empty and dont have circular structures
    return entries.filter(
      (entry: Entry<any>): entry is IArticleCategory =>
        entry.sys.contentType.sys.id === 'articleCategory' &&
        !!entry.fields.title &&
        !isCircular(entry),
    )
  }

  doMapping(entries: doMappingInput<IArticleCategory>) {
    logger.info('Mapping article category', { count: entries.length })

    return entries
      .map<MappedData | boolean>((entry) => {
        try {
          const mapped = mapArticleCategory(entry)
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
          logger.warn('Failed to import article category', {
            error: error.message,
          })
          return false
        }
      })
      .filter((value): value is MappedData => Boolean(value))
  }
}
