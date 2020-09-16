import { MappedData } from '@island.is/api/content-search'
import { logger } from '@island.is/logging'
import { Injectable } from '@nestjs/common'

import { IArticle } from '../../generated/contentfulTypes'
import { mapArticle, Article } from '../../models/article.model'

import { createTerms, getReplacer } from './utils'

@Injectable()
export class ArticleSyncService {
  processSyncData(items) {
    return items.filter((item) => item.sys.contentType.sys.id === 'article')
  }

  doMapping(entries: IArticle[]): MappedData[] {
    logger.info('Mapping articles', { count: entries.length })

    return entries
      .map<MappedData | boolean>((entry) => {
        try {
          let mapped: Article
          let response: string

          entry.fields.relatedArticles = entry.fields?.relatedArticles?.[0]
            ?.fields
            ? (entry.fields.relatedArticles.map(
                ({ sys, fields: { relatedArticles, ...updatedFields } }) => ({
                  sys,
                  fields: updatedFields,
                }),
              ) as IArticle[])
            : []

          mapped = mapArticle(entry)

          try {
            response = JSON.stringify(mapped)
          } catch (e) {
            logger.error('Cannot stringify response', {
              message: e.message,
            })

            // We return a response string without the broken part
            response = JSON.stringify(mapped, getReplacer())
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
            response,
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
        } catch (error) {
          logger.error('Failed to import article', error)
          return false
        }
      })
      .filter((value): value is MappedData => Boolean(value))
  }
}
