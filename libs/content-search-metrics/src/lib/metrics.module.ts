import { Module } from '@nestjs/common'

import { ElasticService } from '@island.is/content-search-toolkit'

import { MetricsController } from './metrics.controller'
import { MetricsService } from './metrics.service'
import { RankedDataService } from './rankedData.service'

@Module({
  controllers: [MetricsController],
  providers: [MetricsService, ElasticService, RankedDataService],
})
export class MetricsModule {}
