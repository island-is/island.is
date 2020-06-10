import { Module } from '@nestjs/common'

import { IndexingController } from './indexing.controller'
import { IndexingService } from './indexing.service'
import { ElasticService } from '@island.is/api/content-search'

console.log(ElasticService)

@Module({
  imports: [ElasticService],
  controllers: [IndexingController],
  providers: [IndexingService],
})
export class AppModule {}
