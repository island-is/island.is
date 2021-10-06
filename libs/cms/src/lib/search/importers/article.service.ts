import { MappedData } from '@island.is/content-search-indexer/types'
import { logger } from '@island.is/logging'
import { Injectable } from '@nestjs/common'
import { Entry } from 'contentful'
import isCircular from 'is-circular'
import { IArticle, IArticleFields } from '../../generated/contentfulTypes'
import { mapArticle, Article } from '../../models/article.model'
import { CmsSyncProvider, processSyncDataInput } from '../cmsSync.service'
import {
  createTerms,
  extractStringsFromObject,
  numberOfProcessEntries,
  numberOfLinks,
} from './utils'

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
    // only process articles that we consider not to be empty and don't have circular structures
    return entries.reduce((processedEntries: IArticle[], entry: Entry<any>) => {
      if (this.validateArticle(entry)) {
        // remove nested related articles from related articles
        const relatedArticles = (entry.fields.relatedArticles || [])
          .map(({ sys, fields }) => {
            // handle if someone deletes an article without removing reference case, this will be fixed more permanently at a later time with nested resolvers
            if (!fields?.relatedArticles) {
              return undefined
            }
            const {
              relatedArticles,
              subArticles,
              ...prunedRelatedArticlesFields
            } = fields
            return {
              sys,
              fields: prunedRelatedArticlesFields,
            }
          })
          .filter((relatedArticle) => Boolean(relatedArticle))

        const subArticles = (entry.fields.subArticles || [])
          .map(({ sys, fields }) => {
            // handle if someone deletes an article without removing reference case, this will be fixed more permanently at a later time with nested resolvers
            if (!fields?.parent || !fields?.title) {
              return undefined
            }
            const { title, url, content, showTableOfContents } = fields
            return {
              sys,
              fields: {
                title,
                slug: url,
                content,
                showTableOfContents,
              },
            }
          })
          .filter((subArticle) => Boolean(subArticle))

        // relatedArticles can include nested articles that point back to this entry
        const processedEntry = {
          ...entry,
          fields: {
            ...entry.fields,
            relatedArticles: (relatedArticles.length
              ? relatedArticles
              : undefined) as IArticleFields['relatedArticles'],
            subArticles: (subArticles.length
              ? subArticles
              : undefined) as IArticleFields['subArticles'],
          },
        }
        if (!isCircular(processedEntry)) {
          processedEntries.push(processedEntry)
        } else {
          logger.warn('Circular reference found in article', {
            id: entry.sys.id,
          })
        }
      }
      return processedEntries
    }, [])
  }

  doMapping(entries: IArticle[]) {
    logger.info('Mapping articles', { count: entries.length })

    return entries
      .map<MappedData | boolean>((entry) => {
        let mapped: Article

        try {
          mapped = mapArticle(entry)
          // get the searchable content of this article
          const parentContent = extractStringsFromObject(mapped.body)
          // get searchable content of all sub articles
          const searchableContent = mapped.subArticles.map((subArticle) =>
            extractStringsFromObject(subArticle.body),
          )
          searchableContent.push(parentContent)
          return {
            _id: mapped.id,
            title: mapped.title,
            content: searchableContent.join(' '), // includes all searchable content in parent and children
            contentWordCount: parentContent.split(/\s+/).length,
            processEntryCount: numberOfProcessEntries(mapped.body),
            ...numberOfLinks(mapped.body),
            type: 'webArticle',
            termPool: createTerms([
              mapped.title,
              mapped.category?.title ?? '',
              mapped.group?.title ?? '',
            ]),
            response: JSON.stringify({ ...mapped, typename: 'Article' }),
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
              {
                key: entry.fields?.processEntry ? 'true' : 'false',
                value: entry.fields?.processEntry ? 'Yes' : 'No',
                type: 'processentry',
              },
              ...(mapped.otherCategories ?? []).map((x) => ({
                key: x.slug,
                value: x.title,
                type: 'category',
              })),
              ...(entry.fields?.organization ?? []).map((x) => ({
                key: x.fields?.slug ?? '',
                value: x.fields?.title,
                type: 'organization',
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
