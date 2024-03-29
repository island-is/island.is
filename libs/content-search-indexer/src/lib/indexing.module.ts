import { Module } from '@nestjs/common'

import { ElasticService } from '@island.is/content-search-toolkit'
import { CmsSyncModule } from '@island.is/cms'

import { IndexingController } from './indexing.controller'
import { IndexingService } from './indexing.service'
import { CacheInvalidationService } from './cache-invalidation.service'

@Module({
  // add the importer nestjs module to the imports array to have access to it's service in the indexing service
  imports: [CmsSyncModule],
  controllers: [IndexingController],
  providers: [CacheInvalidationService, IndexingService, ElasticService],
})
export class IndexingModule {}
