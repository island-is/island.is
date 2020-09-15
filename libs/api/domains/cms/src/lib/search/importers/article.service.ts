import { MappedData } from '@island.is/api/content-search'
import { logger } from '@island.is/logging'
import { Injectable } from '@nestjs/common'

import { IArticle } from '../../generated/contentfulTypes'
import { mapArticle, Article } from '../../models/article.model'

import { createTerms, getCircularReplacer } from './utils'

@Injectable()
export class ArticleSyncService {
  processSyncData(items) {
    const articles = items.filter(
      (item) => item.sys.contentType.sys.id === 'article',
    )

    logger.info('Processing sync data for articles', { count: articles.length })

    return articles
  }

  doMapping(entries: IArticle[]): MappedData[] {
    logger.info('Mapping articles')

    return entries
      .map<MappedData | boolean>((entry) => {
        let mapped: Article

        try {
          entry.fields.relatedArticles = entry.fields?.relatedArticles?.[0]
            ?.fields
            ? (entry.fields.relatedArticles.map(
                ({
                  sys,
                  fields: { relatedArticles, ...prunedRelatedArticlesFields },
                }) => ({
                  sys,
                  fields: prunedRelatedArticlesFields,
                }),
              ) as IArticle[])
            : []

          mapped = mapArticle(entry)
        } catch (error) {
          logger.error('Failed to import article', error)
          return false
        }

        return {
          _id: mapped.id,
          title: mapped.title,
          content: mapped.intro,
          type: 'webArticle',
          termPool: createTerms([
            mapped.title,
            mapped.category?.title,
            mapped.group?.title,
          ]),
          response: JSON.stringify(mapped, getCircularReplacer()),
          tags: [
            {
              key: entry.fields?.group?.fields?.slug,
              value: entry.fields?.group?.fields?.title,
              type: 'group',
            },
            {
              key: entry.fields?.category?.fields?.slug,
              value: entry.fields?.category?.fields?.title,
              type: 'category',
            },
            {
              key: entry.fields?.slug,
              type: 'slug',
            },
          ],
          dateCreated: entry.sys.createdAt,
          dateUpdated: new Date().getTime().toString(),
        }
      })
      .filter((value): value is MappedData => Boolean(value))
  }
}
