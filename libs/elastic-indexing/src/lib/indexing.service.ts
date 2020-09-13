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
    logger.info('Done with sync')
    return true
  }
  // TODO: Remove orphan entries on re-sync
}
