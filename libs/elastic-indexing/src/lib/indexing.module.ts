import { Module } from '@nestjs/common'
import { ElasticService } from '@island.is/api/content-search'
import { CmsSyncModule } from '@island.is/api/domains/cms'
import { IndexingController } from './indexing.controller'
import { IndexingService } from './indexing.service'

@Module({
  imports: [CmsSyncModule],
  controllers: [IndexingController],
  providers: [IndexingService, ElasticService],
})
export class IndexingModule { }
