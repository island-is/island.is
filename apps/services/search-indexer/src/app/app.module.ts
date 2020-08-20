import { Module } from '@nestjs/common'

import { IndexingController } from './indexing.controller'
import { IndexingService } from './indexing.service'
import { ElasticService } from '@island.is/api/content-search'
import { Syncer } from '../contentful/syncer'

@Module({
  controllers: [IndexingController],
  providers: [IndexingService, ElasticService, Syncer],
})
export class AppModule {}
