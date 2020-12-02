import { Module } from '@nestjs/common'
import { ElasticService } from '@island.is/content-search-toolkit'
import { MetricsService } from './metrics.service'
import { MetricsController } from './metrics.controller'
import { RankedDataService } from './rankedData.service'

@Module({
  controllers: [MetricsController],
  providers: [MetricsService, ElasticService, RankedDataService],
})
export class MetricsModule {}
