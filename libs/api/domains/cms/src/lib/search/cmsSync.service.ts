import { logger } from '@island.is/logging'
import { Injectable } from '@nestjs/common'
import _ from 'lodash'
import {
  SearchIndexes,
  SyncOptions,
  SyncResponse,
} from '@island.is/api/content-search'
import { ArticleSyncService } from './importers/article.service'
import { ContentfulService } from './contentful.service'
import { LifeEventsPageSyncService } from './importers/lifeEventsPage.service'
import { ArticleCategorySyncService } from './importers/articleCategory.service'
import { NewsSyncService } from './importers/news.service'

export interface PostSyncOptions {
  locale: keyof typeof SearchIndexes
  token: string
}

@Injectable()
export class CmsSyncService {
  private contentSyncProviders
  constructor(
    private readonly newsSyncService: NewsSyncService,
    private readonly articleCategorySyncService: ArticleCategorySyncService,
    private readonly articleSyncService: ArticleSyncService,
    private readonly lifeEventsPageSyncService: LifeEventsPageSyncService,
    private readonly contentfulService: ContentfulService,
  ) {
    // these are used
    this.contentSyncProviders = [
      this.articleSyncService,
      this.lifeEventsPageSyncService,
      this.articleCategorySyncService,
      this.newsSyncService,
    ]
  }

  // this is triggered from ES indexer service
  async doSync(options: SyncOptions): Promise<SyncResponse<PostSyncOptions>> {
    logger.info('Doing cms sync', options)
    // gets all data that needs importing
    const {
      items,
      deletedItems,
      token,
    } = await this.contentfulService.getSyncEntries(options)
    logger.info('Got sync data')

    // import data from all providers
    const importableData = this.contentSyncProviders.map(
      ({ processSyncData, doMapping }) => {
        const data = processSyncData(items)

        return doMapping(data)
      },
    )

    return {
      add: _.flatten(importableData),
      remove: deletedItems,
      postSyncOptions: {
        locale: options.locale,
        token,
      },
    }
  }

  // write next sync token to elastic after sync to ensure it runs again on failure
  async postSync(options: PostSyncOptions) {
    return this.contentfulService.updateNextSyncToken(options)
  }
}
