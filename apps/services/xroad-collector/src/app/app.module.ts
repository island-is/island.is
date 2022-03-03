import { Module } from '@nestjs/common'

import { ElasticService } from '@island.is/api-catalogue/elastic'
import { ApiCatalogueServicesModule } from '@island.is/api-catalogue/services'

import { CollectorScheduler } from './collector.scheduler'
import { RestServiceCollector } from './restservicecollector.service'

@Module({
  imports: [ApiCatalogueServicesModule],
  controllers: [],
  providers: [ElasticService, RestServiceCollector, CollectorScheduler],
})
export class AppModule {}
