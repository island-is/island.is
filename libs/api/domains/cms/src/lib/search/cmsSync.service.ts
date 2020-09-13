import { logger } from '@island.is/logging'
import { Injectable } from '@nestjs/common'
import { ElasticService, SearchIndexes } from '@island.is/api/content-search'
import { ArticleSyncService } from './importers/article.service'
import { RequestBodySearch, ExistsQuery, Sort } from 'elastic-builder'
import { MappedData, SyncOptions, SyncResponse } from '@island.is/elastic-indexing'
import { ContentfulService } from './contentful.service'
import environment from '../environments/environment'
import { LifeEventsPageSyncService } from './importers/lifeEventsPage.service'
import _ from 'lodash'

@Injectable()
export class CmsSyncService {
  private contentSyncProviders
  constructor(
    private readonly articleSyncService: ArticleSyncService,
    private readonly lifeEventsPageSyncService: LifeEventsPageSyncService,
    private readonly elasticService: ElasticService,
    private readonly contentfulService: ContentfulService,
  ) {
    // these are used 
    this.contentSyncProviders = [
      this.articleSyncService,
      this.lifeEventsPageSyncService
    ]
  }

  async getLastSyncToken(index: SearchIndexes): Promise<string> {
    // TODO: Use new elasticsearch service query here
    const query = new RequestBodySearch()
      .query(new ExistsQuery('nextSyncToken'))
      .sort(new Sort('dateUpdated', 'desc'))
      .size(1)
    try {
      const result = await this.elasticService.deprecatedFindByQuery(
        index,
        query,
      )
      return result.body.hits.hits[0]._source.nextSyncToken
    } catch (e) {
      logger.error('Could not fetch last sync token', {
        error: e,
      })
      return null
    }
  }

  async getSyncData(options: SyncOptions) {
    let typeOfSync
    if (options.fullSync) {
      // this is a full sync, get all data
      typeOfSync = {initial: true}
    } else {
      // this is a partial sync, try and get the last sync token else do full sync
      const nextSyncToken = await this.getLastSyncToken(SearchIndexes[options.locale])
      logger.info('Got last sync token response', {nextSyncToken})
      typeOfSync = nextSyncToken ? {nextSyncToken}: {initial: true}
    }
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
    logger.info('Doing sync', options)
    // gets all data that needs importing
    const {
      items,
      deletedItems,
      token
    } = await this.getSyncData(options)

    // import data from all providers
    const importableData = this.contentSyncProviders.map(({processSyncData, doMapping}) => {
      const data = processSyncData(items)
      return doMapping(data, token)
    })

    return {
      add: _.flatten(importableData),
      remove: deletedItems
    }
  }
}

// TODO: Fix types here