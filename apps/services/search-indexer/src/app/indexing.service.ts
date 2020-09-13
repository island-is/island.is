import { Injectable } from '@nestjs/common'
import {
  ElasticService,
  SearchIndexes,
} from '@island.is/api/content-search'
import _ from 'lodash'
import { ContentfulService } from './contentful.service'
import { logger } from '@island.is/logging'
import { CmsSyncService } from './cmsSync.service'

export interface SyncOptions {
  locale: keyof typeof SearchIndexes
  fullSync: boolean
}

export interface SyncResponse<T> {
  add: T[]
  remove: string[]
}

@Injectable()
export class IndexingService {
  constructor(
    private readonly elasticService: ElasticService,
    private readonly cmsSyncService: CmsSyncService,
  ) {}

  async ping() {
    return this.elasticService.ping()
  }

  // await this.elasticService.deleteByIds(index, deletedItems)
  async doSync(options: SyncOptions) {
    const cmsData = await this.cmsSyncService.doSync(options)
    logger.info('deleting entries from index')
    // await this.elasticService.deleteByIds(SearchIndexes[options.locale], cmsData.remove)
    logger.info('adding entries to index', cmsData.add[0])
    await this.elasticService.bulk(SearchIndexes[options.locale], cmsData)
    logger.info('Done with sync')
    return true
  }
}
