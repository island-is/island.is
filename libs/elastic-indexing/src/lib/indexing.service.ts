import { Injectable } from '@nestjs/common'
import { ElasticService, SearchIndexes } from '@island.is/api/content-search'
import { logger } from '@island.is/logging'
import { CmsSyncService } from '@island.is/api/domains/cms'
import { SyncOptions } from '../types'

@Injectable()
export class IndexingService {
  constructor(
    private readonly elasticService: ElasticService,
    private readonly cmsSyncService: CmsSyncService,
  ) {}

  async ping() {
    return this.elasticService.ping()
  }

  async doSync(options: SyncOptions) {
    const {
      postSyncOptions,
      ...elasticData
    } = await this.cmsSyncService.doSync(options)
    await this.elasticService.bulk(SearchIndexes[options.locale], elasticData)

    // clear index of stale data by deleting all ids but those added on full sync
    if (options.fullSync) {
      logger.info('Removing stale data')
      const allAddedIds = elasticData.add.map(({ _id }) => _id)
      await this.elasticService.deleteAllExcept(
        SearchIndexes[options.locale],
        allAddedIds,
      )
    }

    // allow sync services to clean up after sync
    await this.cmsSyncService.postSync(postSyncOptions)

    logger.info('Done with sync')
    return true
  }
}
