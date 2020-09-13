import { MappedData } from '@island.is/elastic-indexing';
import { logger } from '@island.is/logging';
import { Injectable } from '@nestjs/common';
import { IArticle } from '../../generated/contentfulTypes';
import { mapArticle, Article } from '../../models/article.model';
import { createTerms } from './utils';

@Injectable()
export class ArticleSyncService {
  processSyncData(items) {
    logger.info('Processing sync data for articles')
    // return all articles
    return items.filter((item) => item.sys.contentType.sys.id === 'article')
    /* return rawArticles.map((article) => {
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
    })*/
  }

  doMapping(entries: IArticle[], nextSyncToken: string): MappedData[] {
    logger.info('Mapping articles')
    return entries.map<MappedData | boolean>((entry) => {
      let mapped: Article
      try {
        logger.info(entry)
        mapped = mapArticle(entry)
      } catch(error) {
        logger.error('Failed to import article', error)
        return false
      }

      return {
        _id: mapped.id,
        title: mapped.title,
        content: mapped.content,
        type: 'article',
        termPool: createTerms([
          mapped.title,
          mapped.category?.title,
          mapped.group?.title
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
        dateUpdated: new Date().getTime().toString(),
        nextSyncToken // TODO: Insert this as a tag or find a better place to store it (handle get next sync token)
      }
    }).filter((value): value is MappedData => Boolean(value))
  }
}
