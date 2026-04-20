import { Injectable } from '@nestjs/common'
import { Entry } from 'contentful'
import isCircular from 'is-circular'

import { MappedData } from '@island.is/content-search-indexer/types'
import { logger } from '@island.is/logging'

import { IArticle, IArticleFields } from '../../generated/contentfulTypes'
import { mapArticle, Article } from '../../models/article.model'
import { CmsSyncProvider, processSyncDataInput } from '../cmsSync.service'
import {
  createTerms,
  extractStringsFromObject,
  numberOfProcessEntries,
  numberOfLinks,
  removeEntryHyperlinkFields,
  pruneNonSearchableSliceUnionFields,
  extractChildEntryIds,
} from './utils'

interface MetaData {
  metadata: {
    tags: {
      sys: {
        id: string
        type: 'Link'
        linkType: 'Tag'
      }
    }[]
  }
}

@Injectable()
export class ArticleSyncService implements CmsSyncProvider<IArticle> {
  // Only process articles that we consider not to be empty
  validateArticle(singleEntry: Entry<any> | IArticle): singleEntry is IArticle {
    const isDefaultLocale = singleEntry.sys.locale === 'is-IS'

    const otherLocaleThanDefaultLocaleIsActive =
      !isDefaultLocale &&
      (singleEntry.fields.activeTranslations?.[singleEntry.sys.locale] ?? true)

    return (
      singleEntry.sys.contentType.sys.id === 'article' &&
      !!singleEntry.fields.title &&
      (isDefaultLocale || otherLocaleThanDefaultLocaleIsActive)
    )
  }

  processSyncData(entries: processSyncDataInput<IArticle>) {
    // only process articles that we consider not to be empty and don't have circular structures
    const entriesToUpdate = entries.reduce(
      (processedEntries: IArticle[], entry: Entry<any>) => {
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

              const parent = {
                ...fields.parent,
                fields: { ...fields.parent.fields },
              }

              delete parent['fields']['subArticles']

              return {
                sys,
                fields: {
                  ...fields,
                  parent,
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

          // An entry hyperlink does not need the extra content present in
          // the entry hyperlink associated fields
          // We remove them from the reference itself on nodeType `entry-hyperlink`
          if (processedEntry.fields?.content) {
            removeEntryHyperlinkFields(processedEntry.fields.content)
          }
          // Remove all unnecessary entry hyperlink fields for the subArticles
          if (processedEntry.fields?.subArticles?.length) {
            for (const subArticle of processedEntry.fields.subArticles) {
              removeEntryHyperlinkFields(subArticle.fields.content)
            }
          }
          // Also remove all unnecessary entry hyperlink fields for the relatedArticles
          if (processedEntry.fields?.relatedArticles?.length) {
            for (const relatedArticle of processedEntry.fields
              .relatedArticles) {
              removeEntryHyperlinkFields(relatedArticle.fields.content)
            }
          }

          try {
            const mappedEntry = mapArticle(processedEntry)
            if (!isCircular(mappedEntry)) {
              processedEntries.push(processedEntry)
            } else {
              logger.warn('Circular reference found in article', {
                id: entry?.sys?.id,
              })
            }
          } catch (error) {
            logger.warn('Failed to map article', {
              error: error.message,
              id: entry?.sys?.id,
            })
          }
        }
        return processedEntries
      },
      [],
    )

    return {
      entriesToUpdate,
      entriesToDelete: [],
    }
  }

  doMapping(entries: (IArticle & MetaData)[]) {
    if (entries.length > 0) {
      logger.info('Mapping articles', { count: entries.length })
    }

    return entries
      .map<MappedData | boolean>((entry) => {
        let mapped: Article

        const contentfulTags = (entry?.metadata?.tags ?? [])
          .map((t) => t?.sys?.id)
          .filter(Boolean)

        try {
          mapped = mapArticle(entry)
          // get the searchable content of this article
          const parentContent = extractStringsFromObject(
            mapped.body.map(pruneNonSearchableSliceUnionFields),
          )
          // get searchable content of all sub articles
          const searchableContent = mapped.subArticles.map((subArticle) =>
            extractStringsFromObject(
              subArticle.body.map(pruneNonSearchableSliceUnionFields),
            ),
          )
          searchableContent.push(parentContent)

          const hasMainProcessEntry =
            mapped.processEntry?.processTitle &&
            mapped.processEntry?.processLink

          const processEntryCount =
            (hasMainProcessEntry ? 1 : 0) + numberOfProcessEntries(mapped.body)

          // Tag the document with the ids of its children so we can later look up what document a child belongs to
          const childEntryIds = extractChildEntryIds(entry)

          const keywords = mapped.keywords ?? []
          if (mapped.intro) {
            keywords.push(mapped.intro)
          }

          return {
            _id: mapped.id,
            title: mapped.title,
            content: searchableContent.join(' '), // includes all searchable content in parent and children
            contentWordCount: parentContent.split(/\s+/).length,
            processEntryCount,
            ...numberOfLinks(mapped.body),
            type: 'webArticle',
            termPool: createTerms([
              mapped.title,
              mapped.category?.title ?? '',
              mapped.group?.title ?? '',
            ]),
            response: JSON.stringify({ ...mapped, typename: 'Article' }),
            tags: [
              ...childEntryIds.map((id) => ({
                key: id,
                type: 'hasChildEntryWithId',
              })),
              {
                key: entry.fields?.group?.fields?.slug ?? '',
                value: entry.fields?.group?.fields?.title,
                type: 'group',
              },
              {
                key: entry.fields?.subgroup?.fields?.slug ?? '',
                value: entry.fields?.subgroup?.fields?.title,
                type: 'subgroup',
              },
              {
                key: entry.fields?.category?.fields?.slug ?? '',
                value: entry.fields?.category?.fields?.title,
                type: 'category',
              },
              {
                key: processEntryCount > 0 ? 'true' : 'false',
                value: processEntryCount > 0 ? 'Yes' : 'No',
                type: 'processentry',
              },
              ...(mapped.otherCategories ?? []).map((x) => ({
                key: x.slug,
                value: x.title,
                type: 'category',
              })),
              ...(mapped.otherGroups ?? []).map((x) => ({
                key: x.slug,
                value: x.title,
                type: 'group',
              })),
              ...(mapped.otherSubgroups ?? []).map((x) => ({
                key: x.slug,
                value: x.title,
                type: 'subgroup',
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
              ...contentfulTags.map((tag) => ({
                key: tag,
                type: 'contentfultag',
              })),
              ...keywords.map((keyword) => ({
                key: keyword,
                value: keyword,
                type: 'keyword',
              })),
            ],
            dateCreated: entry.sys.createdAt,
            dateUpdated: new Date().getTime().toString(),
          }
        } catch (error) {
          logger.warn('Failed to import article', {
            error: error.message,
            id: entry?.sys?.id,
          })
          return false
        }
      })
      .filter((value): value is MappedData => Boolean(value))
  }
}
