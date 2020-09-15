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
  }

  doMapping(entries: IArticle[]): MappedData[] {
    logger.info('Mapping articles')
    return entries.map<MappedData | boolean>((entry) => {
      let mapped: Article
      try {
        mapped = mapArticle(entry)
      } catch(error) {
        logger.error('Failed to import article', error)
        return false
      }

      return {
        _id: mapped.id,
        title: mapped.title,
        content: mapped.content,
        type: 'webArticle',
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
        dateUpdated: new Date().getTime().toString()
      }
    }).filter((value): value is MappedData => Boolean(value))
  }
}
