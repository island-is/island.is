import { Injectable } from '@nestjs/common'

import { ElasticService } from '@island.is/content-search-toolkit'
import { logger } from '@island.is/logging'
import { CmsSyncService } from '@island.is/cms'
import {
  ContentSearchImporter,
  SyncOptions,
} from '@island.is/content-search-indexer/types'
import { getElasticsearchIndex } from '@island.is/content-search-index-manager'

@Injectable()
export class IndexingService {
  importers: ContentSearchImporter[]
  constructor(
    private readonly elasticService: ElasticService,
    private readonly cmsSyncService: CmsSyncService,
  ) {
    // add importer service to this array to make it import
    this.importers = [this.cmsSyncService]
  }

  async ping() {
    return this.elasticService.ping()
  }

  async doSync(options: SyncOptions) {
    const {
      syncType = 'fromLast',
      elasticIndex = getElasticsearchIndex(options.locale),
    } = options

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

      if (importer.postSync) {
        logger.info('Importer started post sync', {
          importer: importer.constructor.name,
          index: elasticIndex,
        })
        // allow importers to clean up after import
        await importer.postSync(postSyncOptions)
      }

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

    /*
    calling the sync endpoint should manage all housekeeping tasks such as removing outdated documents
    we need this check to ensure old data is cleared from the index incase sync fails to remove documents
    currently this happens in cms sync in the development environment due to limitations in the Contentful sync API
    */
    if (syncType === 'full' && didImportAll) {
      logger.info('Removing stale data from index', { index: elasticIndex })
      const response = await this.elasticService.deleteAllDocumentsNotVeryRecentlyUpdated(
        elasticIndex,
      )
      logger.info('Removed stale documents', {
        count: response.body.deleted,
        index: elasticIndex,
      })
    }

    logger.info('Indexing service finished sync', { index: elasticIndex })

    return didImportAll
  }
}
