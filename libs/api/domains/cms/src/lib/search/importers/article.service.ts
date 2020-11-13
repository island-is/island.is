import { MappedData } from '@island.is/elastic-indexing/types'
import { logger } from '@island.is/logging'
import { Injectable } from '@nestjs/common'
import { Entry } from 'contentful'
import isCircular from 'is-circular'
import { IArticle, IArticleFields } from '../../generated/contentfulTypes'
import { mapArticle, Article } from '../../models/article.model'
import {
  CmsSyncProvider,
  doMappingInput,
  processSyncDataInput,
} from '../cmsSync.service'
import { createTerms, extractStringsFromObject } from './utils'

@Injectable()
export class ArticleSyncService implements CmsSyncProvider<IArticle> {
  // only process articles that we consider not to be empty
  validateArticle(singleEntry: Entry<any> | IArticle): singleEntry is IArticle {
    return (
      singleEntry.sys.contentType.sys.id === 'article' &&
      !!singleEntry.fields.title
    )
  }

  processSyncData(entries: processSyncDataInput<IArticle>) {
    // only process articles that we consider not to be empty and dont have circular structures
    return entries.reduce((processedEntries: IArticle[], entry: Entry<any>) => {
      if (this.validateArticle(entry)) {
        // remove nested related articles from releated articles
        const relatedArticles = (entry.fields.relatedArticles ?? []).map(
          ({
            sys,
            fields: { relatedArticles, ...prunedRelatedArticlesFields },
          }) => ({
            sys,
            fields: prunedRelatedArticlesFields,
          }),
        )

        // relatedArticles can include nested articles that point back to this entry
        const processedEntry = {
          ...entry,
          fields: {
            ...entry.fields,
            relatedArticles: (relatedArticles.length
              ? relatedArticles
              : undefined) as IArticleFields['relatedArticles'],
          },
        }
        if (!isCircular(processedEntry)) {
          processedEntries.push(processedEntry)
        }
      }
      return processedEntries
    }, [])
  }

  doMapping(entries: doMappingInput<IArticle>) {
    logger.info('Mapping articles', { count: entries.length })

    return entries
      .map<MappedData | boolean>((entry) => {
        let mapped: Article

        try {
          mapped = mapArticle(entry)
          const type = 'webArticle'
          return {
            _id: mapped.id,
            title: mapped.title,
            content: extractStringsFromObject(mapped.body),
            type,
            termPool: createTerms([
              mapped.title,
              mapped.category?.title ?? '',
              mapped.group?.title ?? '',
            ]),
            response: JSON.stringify({ ...mapped, __typename: type }),
            tags: [
              {
                key: entry.fields?.group?.fields?.slug ?? '',
                value: entry.fields?.group?.fields?.title,
                type: 'group',
              },
              {
                key: entry.fields?.category?.fields?.slug ?? '',
                value: entry.fields?.category?.fields?.title,
                type: 'category',
              },
              ...(mapped.otherCategories ?? []).map((x) => ({
                key: x.slug,
                value: x.title,
                type: 'category',
              })),
              {
                key: entry.fields?.slug,
                type: 'slug',
              },
            ],
            dateCreated: entry.sys.createdAt,
            dateUpdated: new Date().getTime().toString(),
          }
        } catch (error) {
          logger.warn('Failed to import article', { error: error.message })
          return false
        }
      })
      .filter((value): value is MappedData => Boolean(value))
  }
}
