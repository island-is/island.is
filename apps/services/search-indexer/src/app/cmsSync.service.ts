import { logger } from '@island.is/logging'
import { Injectable } from '@nestjs/common'
import { ElasticService, SearchIndexes } from '@island.is/api/content-search'
import { ArticleSyncService } from '../importers/article.service'
import { RequestBodySearch, ExistsQuery, Sort } from 'elastic-builder'
import { SyncOptions, SyncResponse } from './indexing.service'
import { ContentfulService } from './contentful.service'
import { environment } from '../environments/environment'

type tag = {
  id: string
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
  nextSyncToken: string
}

@Injectable()
export class CmsSyncService {
  constructor(
    private readonly articleImporterService: ArticleSyncService,
    private readonly elasticService: ElasticService,
    private readonly contentfulService: ContentfulService,
  ) {}

  async getLastSyncToken(index: SearchIndexes): Promise<string | undefined> {
    const query = new RequestBodySearch()
      .query(new ExistsQuery('nextSyncToken'))
      .sort(new Sort('dateUpdated', 'desc'))
      .size(1)
    try {
      const result = await this.elasticService.deprecatedFindByQuery(
        index,
        query,
      )
      return result.body?.hits?.hits[0]?._source?.nextSyncToken
    } catch (e) {
      logger.error('Could not fetch last sync token', {
        error: e,
      })
      return undefined
    }
  }

  async getSyncData(options: SyncOptions) {
    const nextSyncToken = await this.getLastSyncToken(SearchIndexes[options.locale])
    logger.info('Found last sync token', {nextSyncToken})
    const typeOfSync = nextSyncToken ? {nextSyncToken}: {initial: true}
    const syncData = await this.contentfulService.getSyncEntries({
      resolveLinks: true,
      contentTypes: environment.indexableTypes,
      ...typeOfSync
    })
    logger.info('Got sync data')
    return syncData
  }

  // this is triggered from ES indexer service
  async doSync(options: SyncOptions): Promise<SyncResponse<MappedData>> {
    logger.info('doing sync', options)
    // gets all changes since last update
    const {
      items,
      deletedItems,
      token
    } = await this.getSyncData(options)
    const cmsSyncData = await this.articleImporterService.processSyncData(items)
    return {
      add: this.articleImporterService.doMapping(cmsSyncData, token),
      remove: deletedItems
    }
  }
}
