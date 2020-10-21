import { Injectable } from '@nestjs/common'
import {
  ElasticService,
  SearchIndexes,
  SyncOptions,
} from '@island.is/api/content-search'
import { logger } from '@island.is/logging'
import { CmsSyncService } from '@island.is/api/domains/cms'
import { rankQueries } from '../evaluation/rankQueries'

@Injectable()
export class IndexingService {
  private rankQueries
  private index
  constructor(
    private readonly elasticService: ElasticService,
    private readonly cmsSyncService: CmsSyncService,
  ) {}

  async ping() {
    return this.elasticService.ping()
  }

  async doSync(options: SyncOptions) {
    const {
      fullSync = false,
      locale = 'is',
      elasticIndex = SearchIndexes[options.locale],
    } = options
    const {
      postSyncOptions,
      ...elasticData
    } = await this.cmsSyncService.doSync(options)
    await this.elasticService.bulk(elasticIndex, elasticData)

    // clear index of stale data by deleting all ids but those added on full sync
    if (fullSync) {
      logger.info('Removing stale data')
      const allAddedIds = elasticData.add.map(({ _id }) => _id)
      await this.elasticService.deleteAllExcept(elasticIndex, allAddedIds)
    }

    // allow sync services to clean up after sync
    await this.cmsSyncService.postSync(postSyncOptions)

    logger.info('Done with sync')
    return true
  }

  async rankEvaluation(locale: string) {
    const requests = await this.getRankQueries(locale)
    const index = await this.getIndex(locale)

    return this.elasticService.precisionEvaluation(index, requests, 10)
  }

  protected async getIndex(locale: string) {
    if (this.index) {
      return this.index
    }

    const indexes = await this.elasticService
      .getIndexFromAliases(`island-${locale}`)
      .then((response) => response.map((index) => index.index))
    // If no index were found, then default to _all
    const index = indexes[0] ?? '_all'
    this.index = index
    return index
  }

  protected async getRankQueries(locale: string) {
    if (this.rankQueries) {
      return this.rankQueries
    }

    const index = await this.getIndex(locale)
    this.rankQueries = rankQueries.map((entry) => {
      const query = this.elasticService.getSearchQuery({
        queryString: entry.request as string,
        countTag: '',
        page: 1,
        size: 10,
        tags: [],
        types: ['webArticle', 'webLifeEventPage'],
      }).query
      entry.request = { query }
      entry.ratings.map((rating) => (rating._index = index))
      return entry
    })

    return this.rankQueries
  }
}
