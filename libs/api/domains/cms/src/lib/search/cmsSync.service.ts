import { logger } from '@island.is/logging'
import { Injectable } from '@nestjs/common'
import { SearchIndexes } from '@island.is/api/content-search'
import { ArticleSyncService } from './importers/article.service'
import { SyncOptions, SyncResponse } from '@island.is/elastic-indexing'
import { ContentfulService } from './contentful.service'
import { LifeEventsPageSyncService } from './importers/lifeEventsPage.service'
import _ from 'lodash'

export interface PostSyncOptions {
  locale: keyof typeof SearchIndexes
  token: string
}

@Injectable()
export class CmsSyncService {
  private contentSyncProviders
  constructor(
    private readonly articleSyncService: ArticleSyncService,
    private readonly lifeEventsPageSyncService: LifeEventsPageSyncService,
    private readonly contentfulService: ContentfulService,
  ) {
    // these are used
    this.contentSyncProviders = [
      this.articleSyncService,
      this.lifeEventsPageSyncService,
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
