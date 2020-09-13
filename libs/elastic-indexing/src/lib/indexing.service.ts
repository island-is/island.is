import { Injectable } from '@nestjs/common'
import {
  ElasticService,
  SearchIndexes,
} from '@island.is/api/content-search'
import _ from 'lodash'
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
    const cmsData = await this.cmsSyncService.doSync(options)
    await this.elasticService.bulk(SearchIndexes[options.locale], cmsData)

    // clear index of stale data by deleteing all ids but those added
    if (options.fullSync) {
      logger.info('Removing stale data')
      const allAddedIds = cmsData.add.map(({_id}) => _id)
      await this.elasticService.deleteAllExcept(SearchIndexes[options.locale], allAddedIds)
    }

    logger.info('Done with sync')
    return true
  }
}
