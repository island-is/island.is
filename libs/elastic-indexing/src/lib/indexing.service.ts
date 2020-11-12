import { Injectable } from '@nestjs/common'
import { ElasticService, SearchIndexes } from '@island.is/api/content-search'
import { logger } from '@island.is/logging'
import { CmsSyncService } from '@island.is/api/domains/cms'
import { ContentSearchImporter, SyncOptions } from './types'

@Injectable()
export class IndexingService {
  importers: ContentSearchImporter[]
  constructor(
    private readonly elasticService: ElasticService,
    private readonly cmsSyncService: CmsSyncService,
  ) {
    this.importers = [this.cmsSyncService]
  }

  async ping() {
    return this.elasticService.ping()
  }

  async doSync(options: SyncOptions) {
    const {
      syncType = 'fromLast',
      elasticIndex = SearchIndexes[options.locale],
    } = options

    let allImportedIds = [] // se we can delete orphans after full sync
    let didImportAll = true
    const importPromises = this.importers.map(async (importer) => {
      logger.info('Starting importer', {
        importer: importer.constructor.name,
        index: elasticIndex,
      })
      // importers can skip import by returning null
      const importerResponse = await importer.doSync(options)
      if (!importerResponse) {
        didImportAll = false
        return true
      }

      const { postSyncOptions, ...elasticData } = importerResponse
      await this.elasticService.bulk(elasticIndex, elasticData)

      // clear index of stale data by deleting all ids but those added on full sync
      if (syncType === 'full') {
        const allAddedIds = elasticData.add.map(({ _id }) => _id)
        allImportedIds = [...allImportedIds, ...allAddedIds]
      }

      // allow importers to clean up after import
      await importer.postSync(postSyncOptions)
      logger.info('Importer finished sync', {
        importer: importer.constructor.name,
        index: elasticIndex,
      })
      return true
    })

    // wait for all importers to finish
    await Promise.all(importPromises).catch((error) => {
      logger.error('Importer failed', {
        message: error.message,
        index: elasticIndex,
      })
      didImportAll = false
    })

    if (syncType === 'full' && didImportAll) {
      logger.info('Removing stale data from index', { index: elasticIndex })
      await this.elasticService.deleteAllExcept(elasticIndex, allImportedIds)
    }

    logger.info('Indexing service finished sync', { index: elasticIndex })

    return didImportAll
  }
}
