import { MappedData } from '@island.is/elastic-indexing';
import { logger } from '@island.is/logging';
import { Injectable } from '@nestjs/common';
import _ from 'lodash';
import { IArticle } from '../../generated/contentfulTypes';
import { mapArticle } from '../../models/article.model';

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

  doMapping(entries: IArticle[], nextSyncToken: string): MappedData[] {
    logger.info('Mapping articles')
    return entries.map<MappedData | boolean>((entry) => {
      let mapped
      try {
        mapped = mapArticle(entry)
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
        tags: [{
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
        dateUpdated: new Date().toString(),
        nextSyncToken
      }
    }).filter((value): value is MappedData => Boolean(value))
  }
}
