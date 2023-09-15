import { Injectable } from '@nestjs/common'
import { MappedData } from '@island.is/content-search-indexer/types'
import { logger } from '@island.is/logging'
import { CmsSyncProvider } from '../cmsSync.service'
import { ElasticsearchIndexLocale } from '@island.is/content-search-index-manager'
import { Article } from '../../models/article.model'

@Injectable()
export class VacancyPageSyncService implements CmsSyncProvider<Article> {
  processSyncData(
    _entries: unknown[],
    locale: ElasticsearchIndexLocale,
  ): Article[] {
    if (locale !== 'is') return []
    return [
      {
        id: 'starfatorg',
        title: 'Starfatorg - laus störf hjá ríkinu',
        slug: 'starfatorg',
        subArticles: [],
        body: [],
      },
    ]
  }

  doMapping(entries: Article[]) {
    logger.info('Mapping Vacancy Page', { count: entries.length })

    return entries
      .map<MappedData | boolean>((entry) => {
        try {
          const dateString = new Date().getTime().toString()
          return {
            _id: entry.id,
            title: entry.title,
            type: 'webVacancyPage',
            response: JSON.stringify({
              ...entry,
              typename: 'Article',
            }),
            dateCreated: dateString,
            dateUpdated: dateString,
          }
        } catch (error) {
          logger.warn('Failed to import vacancy page', {
            error: error.message,
          })
          return false
        }
      })
      .filter((value): value is MappedData => Boolean(value))
  }
}
