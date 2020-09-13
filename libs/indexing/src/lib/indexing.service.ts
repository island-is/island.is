import { Injectable } from '@nestjs/common'
import {
  ElasticService,
  SearchIndexes,
} from '@island.is/api/content-search'
import _ from 'lodash'
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

type tag = {
  key: string
  value: string
  type: string
}
export interface MappedData {
  id: string
  title: string
  content: string
  type: string
  termPool: string[]
  response: string
  tags: tag[]
  dateUpdated: string
  dateCreated: string
  nextSyncToken: string
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
    await this.elasticService.bulk(SearchIndexes[options.locale], cmsData)
    logger.info('Done with sync')
    return true
  }
  // TODO: Remove orphan entries on full sync
}
