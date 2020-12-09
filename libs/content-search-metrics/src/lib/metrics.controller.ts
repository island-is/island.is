import { Controller, Get, Query } from '@nestjs/common'
import { MetricInput } from './dto/metricInput'
import { MetricsService } from './metrics.service'

@Controller('')
export class MetricsController {
  constructor(private readonly metricsService: MetricsService) {}

  @Get('/search-metrics')
  async getSearchMetrics(@Query() { display, index }: MetricInput) {
    return this.metricsService.getCMSRankEvaluation({ index, display })
  }
}
