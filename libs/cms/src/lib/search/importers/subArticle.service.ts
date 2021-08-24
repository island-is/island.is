import { MappedData } from '@island.is/content-search-indexer/types'
import { logger } from '@island.is/logging'
import { Injectable } from '@nestjs/common'
import { Entry } from 'contentful'
import isCircular from 'is-circular'
import { ISubArticle } from '../../generated/contentfulTypes'
import { Link } from '../../models/link.model'
import { mapSubArticle } from '../../models/subArticle.model'
import { CmsSyncProvider, processSyncDataInput } from '../cmsSync.service'
import { createTerms, extractStringsFromObject } from './utils'

@Injectable()
export class SubArticleSyncService implements CmsSyncProvider<ISubArticle> {
  // only process subArticles that we consider not to be empty
  validateSubArticle(
    singleEntry: Entry<any> | ISubArticle,
  ): singleEntry is ISubArticle {
    return (
      singleEntry.sys.contentType.sys.id === 'subArticle' &&
      !!singleEntry.fields.title &&
      !!singleEntry.fields.slug &&
      !!singleEntry.fields.parent?.fields
    )
  }

  processSyncData(entries: processSyncDataInput<ISubArticle>) {
    logger.info('Processing sync data for subarticles')
    return entries.reduce(
      (processedEntries: ISubArticle[], entry: Entry<any>) => {
        if (this.validateSubArticle(entry)) {
          // remove nested subArticles from parent article
          const {
            subArticles,
            relatedArticles,
            ...prunedArticleFields
          } = entry.fields.parent.fields

          const processedArticle = {
            ...entry.fields.parent,
            fields: {
              ...prunedArticleFields,
            },
          }

          // overwrite the parent as the processed and pruned article
          const processedEntry = {
            ...entry,
            fields: {
              ...entry.fields,
              parent: processedArticle,
            },
          }

          if (!isCircular(processedEntry)) {
            processedEntries.push(processedEntry)
          }
        }
        return processedEntries
      },
      [],
    )
  }

  doMapping(entries: ISubArticle[]) {
    logger.info('Mapping subarticles', { count: entries.length })
    return entries
      .map<MappedData | boolean>((entry) => {
        try {
          const mapped = mapSubArticle(entry)
          const content = extractStringsFromObject(mapped.body)

          return {
            _id: mapped.id,
            title: mapped.title,
            content,
            contentWordCount: content.split(/\s+/).length,
            type: 'webSubArticle',
            termPool: createTerms([mapped.title]),
            response: JSON.stringify({ ...mapped, typename: 'SubArticle' }),
            dateCreated: entry.sys.createdAt,
            dateUpdated: new Date().getTime().toString(),
          }
        } catch (error) {
          logger.warn('Failed to import subarticle', { error: error.message })
          return false
        }
      })
      .filter((value): value is MappedData => Boolean(value))
  }
}
