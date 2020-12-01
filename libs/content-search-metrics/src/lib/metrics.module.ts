import { Module } from '@nestjs/common'
import { ElasticService } from '@island.is/content-search-toolkit'
import { MetricsService } from './metrics.service'
import { MetricsController } from './metrics.controller'

@Module({
  controllers: [MetricsController],
  providers: [MetricsService, ElasticService],
})
export class MetricsModule { }
