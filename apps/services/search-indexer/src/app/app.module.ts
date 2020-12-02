import { Module } from '@nestjs/common'
import { IndexingModule } from '@island.is/content-search-indexer'
import { MetricsModule } from '@island.is/content-search-metrics'

@Module({
  imports: [IndexingModule, MetricsModule],
})
export class AppModule {}
