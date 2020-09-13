import { logger } from '@island.is/logging';
import { Injectable } from '@nestjs/common';
import _ from 'lodash';
import { MappedData } from '../indexing.service';

@Injectable()
export class ArticleSyncService {
  processSyncData(items) {
    logger.info('Processing sync data')
    // return all articles
    const rawArticles = items.filter((item) => item.sys.contentType.sys.id === 'article')
    return rawArticles.map((article) => {
      if (article.fields?.relatedArticles?.[0]?.fields) {
        article.fields.relatedArticles = article.fields.relatedArticles.map(
          (relatedArticle) => {
            // remove related articles from nested articles
            const {
              relatedArticles,
              ...prunedRelatedArticlesFields
            } = relatedArticle.fields
  
            return { fields: prunedRelatedArticlesFields }
          },
        )
      }
      return article
    })
  }

  private createTerms(termStrings: string[]): string[] {
    const singleWords = termStrings.map((termString = '') => {
      const words = termString.toLowerCase()
        .replace(/[^a-záðéíóúýþæö]+/g, ' ') // remove all non characters
        .split(/\s+/)
      return words
    })
    return _.flatten(singleWords)
  }

  mapArticle({ fields, sys }) {
    return {
      id: sys.id,
      contentStatus: fields.contentStatus,
      title: fields.title,
      shortTitle: fields.shortTitle ?? '',
      slug: fields.slug,
      content: (fields.content && JSON.stringify(fields.content)) ?? null,
      category: fields.category?.fields,
      group: fields.group?.fields,
      subgroup: fields.subgroup?.fields,
      organization: '',
      relatedArticles: null,
      subArticles: null,
    }
  }

  doMapping(entries, nextSyncToken): MappedData[] {
    logger.info('Mapping articles')
    return entries.map((entry) => {
      logger.info(entry.sys.id)
      let mapped
      try {
        mapped = this.mapArticle(entry)
      } catch(error) {
        logger.error('Failed to import', error)
        return false
      }
      return {
        _id: mapped.id,
        title: mapped.title,
        content: mapped.content,
        type: 'article',
        termPool: this.createTerms([
          mapped.title,
          mapped.category?.title,
          mapped .group?.title
        ]),
        response: JSON.stringify(mapped),
        tags: [{ // Maybe this?
          key: entry.fields?.group?.fields?.slug,
          value: entry.fields?.group?.fields?.title,
          type: 'group'
        },
        {
          key: entry.fields?.category?.fields?.slug,
          value: entry.fields?.category?.fields?.title,
          type: 'category'
        }],
        dateCreated: entry.sys.createdAt,
        dateUpdated: new Date(),
        nextSyncToken
      }
    }).filter((value) => Boolean(value))
  }
}
